import React, {Component} from 'react';
import {ActionSheetIOS, FlatList, SectionList, Text, View, StyleSheet, TouchableWithoutFeedback, TouchableHighlight, Alert, Switch} from 'react-native';
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
  }

  componentWillMount() {
    this.setAccounts(TEST_ACCOUNTS);
    // TODO: load calendars.
  }

  setAccounts = (accounts) => {
    const calendars = accounts
      .map(acc => acc.calendars)
      .reduce((a, b) => [...a, ...b], []);
    const enabled = calendars.reduce((res, cal) => {
      return {...res, [cal.calendar_id]: cal.enabled}
    }, {});
    this.setState({
      accounts,
      enabled,
      defaultCalendar: calendars[0],
      defaultAccount: accounts[0],
    });
  }

  _onLogin = (googleUser) => {
    console.log(googleUser);
    // TODO: send google api token, load calendars for the new account.
  }

  setIsEnabled = (calendar, value) => {
    this.setState({
      enabled: {
        ...this.state.enabled,
        [calendar.calendar_id]: value,
      }
    });
  }

  getIsEnabled = (calendar) => {
    return this.state.enabled[calendar.calendar_id];
  }

  _onDropdownSelect = (item) => {
    this.setState({
      defaultAccount: item.account,
      defaultCalendar: item.data,
    });
  }

  _onAddEventsPress = () => {
    const calendars = this.state.accounts
      .map(acc => acc.calendars.map(cal => ({acc, cal})))
      .reduce((a, b) => [...a, ...b], [])
    const calendarNames = calendars.map(item => item.acc.name + ' ' + item.cal.name)
    ActionSheetIOS.showActionSheetWithOptions({
      title: 'Select calendar',
      options: [...calendarNames, 'Cancel'],
      cancelButtonIndex: calendars.length,
    }, (index) => {
      if (index != calendars.length) {
        this.setState({
          defaultCalendar: calendars[index].cal,
          defaultAccount: calendars[index].acc,
        })
      }
    })
  }

  _onAddAccountPress = () => {
    // TODO: if successful, refresh calendars
    loginToGoogle().then(user => {
      console.log(user)
      this.props.appActions.sendGoogleAuthToken(user.serverAuthCode)
    }).catch(err => {
      console.log(err)
    })
  }

  _onLogoutPress = () => {
    // TODO: use cross platform action-sheet of expo instead
    ActionSheetIOS.showActionSheetWithOptions({
      title: 'Are you sure?',
      options: ['Logout', 'Cancel'],
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
    const sections2 = [
      createSection(ACCOUNTS, accountsData),
      createSection(ADD_EVENTS),
      createSection(ADD_ACCOUNT),
      createSection(LOGOUT)
    ];
    return (
      <View style={styles.container}>
        <TopBar isMainScene>
          <Text style={[s.textColorTheme, {fontSize: 16}, s.bold]}>Settings</Text>
        </TopBar>
        <SectionList
          removeClippedSubviews={false}
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
                      <View style={[s.row, {marginTop: 5}]}>
                        <Text style={{fontSize: 15, color: 'grey'}}>
                          {defaultAccount ? defaultAccount.name : ""}
                        </Text>
                        <Text style={{fontSize: 14, paddingLeft: 15, color: 'black'}}>
                          {defaultCalendar ? defaultCalendar.name : ""}
                        </Text>
                      </View>
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
                    <Text style={[s.bold, s.textColorTheme, {fontSize: 16}]}>Logout</Text>
                    <IconIon name="ios-arrow-forward" size={20} color="black" style={{marginLeft: 5, marginTop: 5, marginRight: 3}}/>
                  </SettingsRow>
                )
            }
          }}
          renderSectionHeader={({section}) => {
            if (section.type == ACCOUNTS) {
              return <View><Text style={[s.bold, {padding: 10, paddingLeft: 20, fontSize: 16, color: 'grey'}]}>Calendar Accounts</Text></View>
            }
            return <View style={{margin: 7}}></View>
          }}
          sections={sections2}
        />
      </View>
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

const TEST_ACCOUNTS = [
  {
    id: "2399402",
    name: "tomray@gmail.com",
    calendars: [
      {
        calendar_id: "73485",
        name: "personal",
        enabled: true,
      },
      {
        calendar_id: "45869",
        name: "school",
        enabled: true,
      },
      {
        calendar_id: "734851",
        name: "other",
        enabled: true,
      },
      {
        calendar_id: "458691",
        name: "holidays",
        enabled: false,
      },
    ]
  },
  {
    id: "8459",
    name: "raytom@domain.com",
    calendars: [
      {
        calendar_id: "950",
        name: "work",
        enabled: false,
      },
      {
        calendar_id: "354960",
        name: "club",
        enabled: true,
      },
    ]
  },
  {
    id: "46366",
    name: "raytom2@domain.com",
    calendars: [
      {
        calendar_id: "44950",
        name: "meetings",
        enabled: false,
      },
      {
        calendar_id: "3547960",
        name: "sport",
        enabled: true,
      },
    ]
  },
]
