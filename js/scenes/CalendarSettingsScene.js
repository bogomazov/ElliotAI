import React, {Component} from 'react';
import {FlatList, Text, View, StyleSheet, TouchableWithoutFeedback, TouchableHighlight} from 'react-native';
import {connect} from 'react-redux';
import TopBar from '../components/TopBar';
import s from '../res/values/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import GoogleLoginButton from '../containers/GoogleLoginButton';

const ACCOUNT = 0;
const CALENDAR = 1;

export default class CalendarSettingsScene extends Component {
  state = {
    accounts: [],
    selected: new Map(),
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
    // TODO: post settings to back-end then dispatch didFinishCalendarIntro
  }

  render() {
    console.log(this.state);
    const {accounts, selected} = this.state;
    const sections = accounts.map(acc => {
      const calendars = acc.calendars.map(cal => ({data: cal, type: CALENDAR, key: cal.calendar_id}));
      return [{data: acc, type: ACCOUNT, key: acc.id}, ...calendars];
    });
    const listData = sections.reduce((a, b) => [...a, ...b], []);
    return (
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <TopBar isMainScene>
          <View style={[s.row, {flex: 1, justifyContent: 'space-between'}]}>
            <Text style={[s.textColorWhite, {fontSize: 16, marginRight: 10}, s.bold]}>Next</Text>
            <Text style={[s.textColorTheme, {fontSize: 16}, s.bold]}>Manage Calendars</Text>
            <TouchableHighlight onPress={this._onPressNext} underlayColor="white">
              <Text style={[s.textColorTheme, {fontSize: 16, marginRight: 10}, s.bold]}>Next</Text>
            </TouchableHighlight>
          </View>
        </TopBar>
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
