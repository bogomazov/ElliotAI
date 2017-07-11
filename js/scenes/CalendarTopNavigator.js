import {TabNavigator} from 'react-navigation';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as appActions from '../state/actions/app';
import {FlatList, View} from 'react-native';
import MeetingCard from '../components/MeetingCard';

const mapStateToProps = (state) => {
  return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class CalendarTab extends Component {
  _refresh = () => {
    this.props.appActions.calendarLoading()
		this.props.appActions.loadScheduledMeetings()
	}

  render() {
    const {routeName} = this.props.navigation.state;
    console.log(routeName);
    const meetings = (
      routeName === 'UpcomingTab' ? this.props.app.upcomingMeetings : this.props.app.pastMeetings
    );
    return (
      <FlatList
        removeClippedSubviews={false}
        onRefresh={this._refresh}
        refreshing={this.props.app.isCalendarLoading}
        data={meetings}
        keyExtractor={(item, index) => item.suggestion_id}
        renderItem={({item}, i) => {
          console.log(i)
          return <View key={i}>
                    <MeetingCard
                          meeting={item}
                          onPress={this.props.screenProps.onMeetingPress}/>
                  </View>}} />
    );
  }
}

const CalendarTopNavigator = TabNavigator({
  UpcomingTab: {
    screen: CalendarTab,
    navigationOptions: {
      tabBarVisible: false,
    }
  },
  PastTab: {
    screen: CalendarTab,
    navigationOptions: {
      tabBarVisible: false,
    }
  },
})

export default CalendarTopNavigator;
