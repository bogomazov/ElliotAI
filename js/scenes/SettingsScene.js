import React, {Component} from 'react';
import {
  ActionSheetIOS,
  FlatList,
  SectionList,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Alert,
  Switch
} from 'react-native';
import TopBar from '../components/TopBar';
import s, {themeColor, themeColorLight, mainBackgroundColor} from '../res/values/styles';
import ModalDropdown from 'react-native-modal-dropdown';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as appActions from '../state/actions/app';
import DropdownPicker from '../containers/DropdownPicker';
import IconIon from 'react-native-vector-icons/Ionicons';
import SettingsRow from '../components/SettingsRow';
import SettingsAccountRow from '../components/SettingsAccountRow';
import {loginToGoogle} from '../utils/GoogleLogin';
import ActionSheet from '@expo/react-native-action-sheet';

const ACCOUNT = 0;
const CALENDAR = 1;

const ACCOUNTS = 0
const ADD_EVENTS = 1
const ADD_ACCOUNT = 2
const LOGOUT = 3

const mapStateToProps = (state) => {
	return {state}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SettingsScene extends Component {
  static navigationOptions = {
    tabBarIcon: ({tintColor, focused}) =>
       <IconIon name="ios-settings-outline" color={focused? themeColor: 'grey'} size={focused? 42: 38} />
  };

  state = {
    accounts: [],
    enabled: {},
    defaultAccount: null,
    defaultCalendar: null,
    expandedAccountId: -1,
    isLoading: false,
  }

  componentWillMount() {
    this.loadCalendarAccounts()
  }

  showTryAgainAlert = () => {
    Alert.alert('Connection Error', 'Please try again', [
      {text: 'OK'},
    ], {
      cancelable: true
    });
  }

  loadCalendarAccounts = () => {
    this.setState({isLoading: true})
    this.props.appActions.loadCalendarAccounts()
      .then((accounts) => {
        this.setState({isLoading: false})
        this.setAccounts(accounts)
      }).catch(err => {
        console.log(err)
        this.setState({isLoading: false})
      })
  }

  setAccounts = (accounts) => {
    const calendars = accounts
      .map(acc =>
        acc.calendars.map(cal => ({...cal, account: acc}))
      ).reduce((a, b) => [...a, ...b], []);
    const enabled = calendars.reduce((res, cal) => {
      return {...res, [cal.calendar_id]: cal.enabled}
    }, {});
    const defaultCals = calendars.filter(cal => cal.default);
    const defaultCalendar = defaultCals.length > 0 ? defaultCals[0] : null;
    const defaultAccount = defaultCalendar ? defaultCalendar.account : null;
    this.setState({
      accounts,
      enabled,
      defaultCalendar,
      defaultAccount,
    });
  }

  setIsEnabled = (calendar, value) => {
    const oldState = this.state
    this.setState({
      enabled: {
        ...this.state.enabled,
        [calendar.calendar_id]: value,
      }
    });
    this.props.appActions.editCalendar(
      calendar.calendar_id,
      value,
      calendar.default
    ).catch((err) => {
      console.log(err);
      this.setState(oldState)
      this.showTryAgainAlert()
    })
  }

  getIsEnabled = (calendar) => {
    return this.state.enabled[calendar.calendar_id];
  }

  _onAddEventsPress = () => {
    const calendars = this.state.accounts
      .map(acc => acc.calendars.map(cal => ({acc, cal})))
      .reduce((a, b) => [...a, ...b], [])
    const calendarNames = calendars.map(item => item.cal.name)
    this.actionSheet.showActionSheetWithOptions({
      title: 'Select calendar',
      options: [...calendarNames, 'Cancel'],
      cancelButtonIndex: calendars.length,
    }, (index) => {
      if (index != calendars.length) {
        const oldState = this.state
        this.setState({
          defaultCalendar: calendars[index].cal,
          defaultAccount: calendars[index].acc,
        })
        this.props.appActions.editCalendar(
          calendars[index].cal.calendar_id,
          this.getIsEnabled(calendars[index].cal),
          true,
        ).catch(err => {
          console.log(err)
          this.setState(oldState)
          this.showTryAgainAlert()
        })
      }
    })
  }

  _onAddAccountPress = () => {
    loginToGoogle().then(user => {
      console.log(user)
      this.props.appActions.sendGoogleAuthToken(user.serverAuthCode)
        .then(() => {
          this.loadCalendarAccounts()
        }).catch((err) => {
          console.log(err)
          // TODO: show an alert or in-app notif to let user retry
        })
    }).catch(err => {
      console.log(err)
    })
  }

  _onLogoutPress = () => {
    this.actionSheet.showActionSheetWithOptions({
      title: 'Are you sure?',
      options: ['Log out', 'Cancel'],
      destructiveButtonIndex: 0,
      cancelButtonIndex: 1,
    }, (index) => {
      if (index == 0) {
        this.props.appActions.logOut()
      }
    })
  }

  render() {
    console.log(this.state);
    const {
      accounts,
      defaultCalendar,
      defaultAccount
    } = this.state;
    const accountsData = accounts.map(acc => ({account: acc, key: acc.id}))
    const createSection = (type, data = [{key: 0}]) => {
      return {
        type,
        key: type,
        data: data.map((item) => ({...item, section: type}))
      }
    }
    const sections = [
      createSection(ACCOUNTS, accountsData),
      createSection(ADD_EVENTS),
      createSection(ADD_ACCOUNT),
      createSection(LOGOUT)
    ];
    return (
      <ActionSheet ref={(ref) => this.actionSheet = ref}>
        <View style={styles.container}>
          <TopBar isMainScene>
            <Text style={[s.textColorTheme, {fontSize: 16}, s.bold]}>Settings</Text>
          </TopBar>
          <SectionList
            onRefresh={this.loadCalendarAccounts}
            refreshing={this.state.isLoading}
            removeClippedSubviews={false}
            sections={sections}
            ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: mainBackgroundColor}}></View>}
            renderItem={({item}) => {
              switch (item.section) {
                case ACCOUNTS:
                  return (
                    <SettingsAccountRow
                      account={item.account}
                      isExpanded={this.state.expandedAccountId === item.account.id}
                      onExpand={() => {
                        if (this.state.expandedAccountId === item.account.id) {
                          this.setState({expandedAccountId: -1})
                        } else {
                          this.setState({expandedAccountId: item.account.id})
                        }
                      }}
                      setIsEnabled={this.setIsEnabled}
                      getIsEnabled={this.getIsEnabled}
                    />
                  )
                case ADD_EVENTS:
                  return (
                    <SettingsRow onPress={this._onAddEventsPress}>
                      <View>
                        <Text style={[s.bold, s.textColorTheme, {fontSize: 16}]}>Adding meetings to:</Text>
                        {defaultAccount && defaultCalendar &&
                          <View style={[s.col, {marginTop: 5}]}>
                            <Text>
                              <Text style={{fontSize: 14, color: 'black'}}>
                                {defaultAccount.name + ": "}
                              </Text>
                              <Text style={{fontSize: 14, color: 'gray'}}>
                                {defaultCalendar.name}
                              </Text>
                            </Text>
                          </View>
                        }
                      </View>
                      <IconIon name="ios-arrow-forward" size={20} color="black" style={{marginLeft: 5, marginTop: 5, marginRight: 3}}/>
                    </SettingsRow>
                  )
                case ADD_ACCOUNT:
                  return (
                    <SettingsRow onPress={this._onAddAccountPress}>
                      <Text style={[s.bold, s.textColorTheme, {fontSize: 16}]}>Add another account</Text>
                      <IconIon name="logo-googleplus" size={20} color="black" style={{marginLeft: 5, marginTop: 5, marginRight: 3}}/>
                    </SettingsRow>
                  )
                case LOGOUT:
                  return (
                    <SettingsRow onPress={this._onLogoutPress}>
                      <Text style={[s.bold, s.textColorTheme, {fontSize: 16}]}>Log out of Elliot</Text>
                      <IconIon name="ios-arrow-forward" size={20} color="black" style={{marginLeft: 5, marginTop: 5, marginRight: 3}}/>
                    </SettingsRow>
                  )
              }
            }}
            renderSectionHeader={({section}) => {
              if (section.type == ACCOUNTS) {
                return <View><Text style={[s.bold, {padding: 5, paddingLeft: 20, fontSize: 16, color: themeColor}]}>Calendar Accounts</Text></View>
              }
              return <View style={{margin: 7}}></View>
            }}
          />
        </View>
      </ActionSheet>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: mainBackgroundColor,
  },
});
