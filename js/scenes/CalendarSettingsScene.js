import React, {Component} from 'react';
import {FlatList, Text, View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import TopBar from '../components/TopBar';
import s from '../res/values/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

const ACCOUNT = 0;
const CALENDAR = 1;

export default class CalendarSettingsScene extends Component {
  state = {
    accounts: [],
  }

  componentWillMount() {
    this.setState({accounts: TEST_ACCOUNTS});
  }

  _onLogin = (googleUser) => {
    console.log(googleUser);
  }

  render() {
    console.log(this.state);
    const {accounts} = this.state;
    const sections = accounts.map(acc => {
      const calendars = acc.calendars.map(cal => ({data: cal, type: CALENDAR, key: cal.calendar_id}));
      return [{data: acc, type: ACCOUNT, key: acc.id}, ...calendars];
    });
    const listData = sections.reduce((a, b) => [...a, ...b], []);
    return (
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <TopBar isMainScene>
          <Text style={[s.textColorTheme, {fontSize: 16}, s.bold]}>Manage Calendars</Text>
        </TopBar>
        <Text style={[s.textColorTheme, {fontSize: 15, margin: 10}, s.bold]}>Select Calendars to be considered when scheduling meetings</Text>
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
              <View style={styles.calendar}>
                <Text style={{fontSize: 15}}>{item.data.name}</Text>
                <Icon name="md-checkmark" size={20} color="green"/>
              </View>
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
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 15,
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
