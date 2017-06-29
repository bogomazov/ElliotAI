import React, {Component} from 'react';
import {FlatList, Text, View, StyleSheet, TouchableWithoutFeedback, TouchableHighlight, Alert} from 'react-native';
import {connect} from 'react-redux';
import TopBar from '../components/TopBar';
import s, {themeColorLight} from '../res/values/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import GoogleLoginButton from '../containers/GoogleLoginButton';
import ModalDropdown from 'react-native-modal-dropdown';

const ACCOUNT = 0;
const CALENDAR = 1;

export default class CalendarSettingsScene extends Component {
  state = {
    accounts: [],
    selected: new Map(),
    calendarToAdd: null,
  }

  componentWillMount() {
    this.setState({accounts: TEST_ACCOUNTS});
    // TODO: load calendars.
  }

  _onLogin = (googleUser) => {
    console.log(googleUser);
    // TODO: send google api token, load calendars for the new account.
  }

  _onPressCalendar = (calendar) => {
    const id = calendar.calendar_id;
    const selected = new Map(this.state.selected);
    const prevSelected = selected.has(id) ? selected.get(id) : true;
    selected.set(id, !prevSelected);
    this.setState({selected});
  }

  _onPressNext = () => {
    console.log('on press next');
    if (!this.state.calendarToAdd) {
      Alert.alert("Can't continue", 'Please select a calendar for us to add scheduled meetings first.', [
        {text: 'OK', onPress: () => console.log('Pressed ok')},
      ], {
        cancelable: true
      });
      return;
    }
    // TODO: post settings to back-end then dispatch didFinishCalendarIntro
  }

  _onDropdownSelect = (calendar) => {
    this.setState({calendarToAdd: calendar})
  }

  render() {
    console.log(this.state);
    const {accounts, selected} = this.state;
    const sections = accounts.map(acc => {
      const calendars = acc.calendars.map(cal => ({data: cal, type: CALENDAR, key: cal.calendar_id, account: acc}));
      return [{data: acc, type: ACCOUNT, key: acc.id}, ...calendars];
    });
    const listData = sections.reduce((a, b) => [...a, ...b], []);
    const dropDownData = listData.filter(item => item.type == CALENDAR);
    return (
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <TopBar isMainScene>
          <View style={[s.row, {flex: 1, justifyContent: 'center'}]}>
            <Text style={[s.textColorTheme, {fontSize: 16}, s.bold]}>Manage Calendars</Text>
            <View style={styles.next}>
              <TouchableHighlight onPress={this._onPressNext} underlayColor="white">
                <Text style={[s.textColorTheme, {fontSize: 16, marginRight: 10}, s.bold]}>{this.props.isIntro ? "Next" : "Save"}</Text>
              </TouchableHighlight>
            </View>
          </View>
        </TopBar>
        <View style={[s.row, s.margin10, {alignItems: 'center'}]}>
          <Text style={[s.textColorTheme, s.bold, {fontSize: 15}]}>Add meetings to: </Text>
          <View style={[s.row, styles.dropdown, {alignItems: 'center'}]}>
            <ModalDropdown
              onSelect={(index) => this._onDropdownSelect(dropDownData[index].data)}
              options={dropDownData.map(item => item.account.name + ' ' + item.data.name)}
              defaultValue="Please select a calendar"
            />
            <Icon name="ios-arrow-down" size={20} color="black" style={{marginLeft: 5, marginTop: 5,}}/>
          </View>
        </View>
        <Text style={[s.textColorTheme, {fontSize: 15, margin: 10}, s.bold]}>Select Calendars</Text>
        <FlatList
          data={listData}
          renderItem={({item}) => {
            if (item.type == ACCOUNT) {
              return (
                <View style={styles.account}>
                  <Text style={{fontSize: 15}}>{item.data.name}</Text>
                </View>
              )
            }
            return (
                <TouchableWithoutFeedback onPress={() => this._onPressCalendar(item.data)}>
                  <View style={styles.calendar}>
                    <Text style={{fontSize: 15}}>{item.data.name}</Text>
                    {(!selected.has(item.data.calendar_id) ||
                      selected.get(item.data.calendar_id)) &&
                      <Icon name="md-checkmark" size={16} color="green"/>
                    }
                  </View>
                </TouchableWithoutFeedback>
            )
          }}
        />
        <View style={[s.col, {alignItems: 'center', marginBottom: 30}]}>
          <Text style={[s.textColorTheme, s.bold]}>Add another account?</Text>
          <GoogleLoginButton onLogin={this._onLogin} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  account: {
    marginLeft: 10,
    borderTopWidth: 1,
    padding: 5,
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 15,
    padding: 5,
  },
  dropdown: {
    backgroundColor: themeColorLight,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: 5,
    marginTop: 5,
    borderRadius: 10,
  },
  next: {
    position: 'absolute',
    right: 5,
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
    ]
  },
  {
    id: "8459",
    name: "raytom@domain.com",
    calendars: [
      {
        calendar_id: "950",
        name: "work",
        enabled: true,
      },
      {
        calendar_id: "354960",
        name: "club",
        enabled: true,
      },
    ]
  },
]
