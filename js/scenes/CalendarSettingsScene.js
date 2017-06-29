import React, {Component} from 'react';
import {FlatList, Text, View, StyleSheet, TouchableWithoutFeedback, TouchableHighlight, Alert, Switch} from 'react-native';
import TopBar from '../components/TopBar';
import s, {themeColorLight, mainBackgroundColor} from '../res/values/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import GoogleLoginButton from '../containers/GoogleLoginButton';
import ModalDropdown from 'react-native-modal-dropdown';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as appActions from '../state/actions/app';
import DropdownPicker from '../containers/DropdownPicker';

const ACCOUNT = 0;
const CALENDAR = 1;

const mapStateToProps = (state) => {
	return {state}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class CalendarSettingsScene extends Component {
  state = {
    accounts: [],
    enabled: {},
    defaultAccount: null,
    defaultCalendar: null,
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

  _onPressNext = () => {
    console.log('on press next');

    // TODO: post settings to back-end then dispatch didFinishCalendarIntro
    this.props.appActions.finishCalendarIntro()
  }

  _onDropdownSelect = (item) => {
    this.setState({
      defaultAccount: item.account,
      defaultCalendar: item.data,
    });
  }

  render() {
    console.log(this.state);
    const {
      accounts,
      defaultCalendar,
      defaultAccount
    } = this.state;
    const sections = accounts.map(acc => {
      const calendars = acc.calendars.map(cal => ({data: cal, type: CALENDAR, key: cal.calendar_id, account: acc}));
      return [{data: acc, type: ACCOUNT, key: acc.id}, ...calendars];
    });
    const listData = sections.reduce((a, b) => [...a, ...b], []);
    const dropDownData = listData.filter(item => item.type == CALENDAR);
    return (
      <View style={styles.container}>
        <TopBar isMainScene>
          <View style={[s.row, {flex: 1, justifyContent: 'center'}]}>
            <Text style={[s.textColorTheme, {fontSize: 16}, s.bold]}>Manage Calendars</Text>
            <View style={styles.next}>
              <TouchableHighlight onPress={this._onPressNext} underlayColor="white">
                <Text style={[s.textColorTheme, {fontSize: 16}, s.bold]}>{this.props.isIntro ? "Next" : "Save"}</Text>
              </TouchableHighlight>
            </View>
          </View>
        </TopBar>
        <View style={[s.row, s.margin10, {alignItems: 'center', justifyContent: 'flex-start'}]}>
          <Text style={[s.textColorTheme, s.bold, {fontSize: 15}]}>Add meetings to: </Text>
          <DropdownPicker
            style={{flex: 1, alignSelf: 'stretch', marginLeft: 5}}
            dropdownStyle={styles.dropdownList}
            onSelect={(index) => this._onDropdownSelect(dropDownData[index])}
            options={dropDownData}
            renderRow={(item, id, highlighted) => {
              return (
                <View style={{backgroundColor: mainBackgroundColor}}>
                  <Text style={{fontSize: 15, paddingLeft: 10, color: 'grey'}}>{item.account.name}</Text>
                  <Text style={{fontSize: 14, paddingLeft: 20, color: 'black'}}>{item.data.name}</Text>
                </View>
              );
            }}>
            <View style={[s.row, styles.dropdown]}>
              <View>
                <Text style={{fontSize: 15, paddingLeft: 5, color: 'grey'}}>
                  {defaultAccount ? defaultAccount.name : ""}
                </Text>
                <Text style={{fontSize: 14, paddingLeft: 15, color: 'black'}}>
                  {defaultCalendar ? defaultCalendar.name : ""}
                </Text>
              </View>
              <Icon name="ios-arrow-down" size={20} color="black" style={{marginLeft: 5, marginTop: 5, marginRight: 3}}/>
            </View>
          </DropdownPicker>
        </View>
        <View style={[s.row, styles.enableTitleWrapper]}>
          <Text style={[s.textColorTheme, s.bold, styles.enableTitle]}>Enable/Disable Calendars</Text>
        </View>
        <FlatList
          data={listData}
          renderItem={({item}) => {
            if (item.type == ACCOUNT) {
              return (
                <View style={styles.account}>
                  <Text style={styles.accountTitle}>{item.data.name}</Text>
                </View>
              )
            }
            return (
              <View style={styles.calendar}>
                <Text style={styles.calendarTitle}>{item.data.name}</Text>
                <Switch
                  onValueChange={(value) => this.setIsEnabled(item.data, value)}
                  value={this.getIsEnabled(item.data)}
                />
              </View>
            )
          }}
        />
        <View style={[s.col, styles.anotherAccountWrapper]}>
          <Text style={[s.textColorTheme, s.bold]}>Add another account?</Text>
          <GoogleLoginButton onLogin={this._onLogin} />
        </View>
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
  enableTitleWrapper: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: themeColorLight
  },
  enableTitle: {
    fontSize: 15,
    padding: 10,
    paddingBottom: 5,
  },
  account: {
    marginTop: 5,
    marginLeft: 10,
    padding: 5,
  },
  accountTitle: {
    fontSize: 15,
    color: 'grey',
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 5,
    paddingRight: 10,
    paddingLeft: 25,
    borderTopWidth: 2,
    borderTopColor: mainBackgroundColor,
  },
  calendarTitle: {
    fontSize: 15,
  },
  dropdown: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: themeColorLight,
    marginTop: 5,
    borderRadius: 5,
    padding: 2,
    paddingLeft: 10,
    paddingRight: 10
  },
  next: {
    position: 'absolute',
    right: 10,
  },
  anotherAccountWrapper: {
    alignItems: 'center',
    marginBottom: 30,
    borderTopWidth: 1,
    borderTopColor: themeColorLight,
    paddingTop: 10,
  },
  dropdownList: {
    borderWidth: 5,
    borderRadius: 5,
    padding: 5,
    borderColor: themeColorLight,
    backgroundColor: mainBackgroundColor,
    marginTop: -25,
  }
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
