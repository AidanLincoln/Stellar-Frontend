import React, {Fragment} from "react";
import addMonths from 'date-fns/addMonths'
import subMonths from 'date-fns/subMonths'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import startOfMonth from 'date-fns/startOfMonth'
import endOfMonth from 'date-fns/endOfMonth'
import endOfWeek from 'date-fns/endOfWeek'
import isSameMonth from 'date-fns/isSameMonth'
import isSameDay from 'date-fns/isSameDay'
import startOfWeek from 'date-fns/startOfWeek'
import '../calendar.css'
import EventForm from './AddEvent'
import {api} from '../services/api'

class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    form: false
  };

  renderHeader() {
    const dateFormat = "MMMM yyyy";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              !isSameMonth(day, monthStart)
                ? "disabled"
                : isSameDay(day, selectedDate) ? "selected" : ""
            }`}
            key={day}
            onClick={() => this.onDateClick(cloneDay)}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  onDateClick = day => {
    this.setState(prev => {
      return {
      selectedDate: day,
      }
    });
    // //ADD CLASS TOGGLE To SHOW/HIDE THE ADD EVENT FORM
    // if (this.state.form){
    //   document.getElementbyId("EventForm").style.display = 'block'
    // } else {
    //   document.getElementbyId("EventForm").style.display = 'none'
    // }

  };

  nextMonth = () => {
    this.setState({
      currentMonth: addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: subMonths(this.state.currentMonth, 1)
    });
  };

  handleClick = () => {
    this.setState(prev => {
      return {
        form: !prev.form
      }
    })
  }

  onAddEvent = (event) => {
    //associate event with calendar and user
    this.props.onAddEvent(event)
    this.props.history.push('/event')
  }

  showForm = () => {
    if (this.state.form === true) {
      return <EventForm onAddEvent={this.onAddEvent} style={{display: "block"}} show={this.state.form} date={this.state.selectedDate}/>
    } else {
      return <EventForm onAddEvent={this.onAddEvent} show={this.state.form} style={{display:'none'}}/>}
  }

getCal = () => {
  api.auth.getCalendars()
    .then(data => {
      console.log(data.filter(calendar => calendar.user_id == this.props.user.id))
    })
}

componentDidMount(){
  this.getCal()
}

  render() {
    return (
      <div className="flex-container">
          <div className="calendar left-column">
            <h1>My Calendar</h1>
            {this.renderHeader()}
            {this.renderDays()}
            {this.renderCells()}
            <input type="button" onClick={this.handleClick} value="Add Event"></input>
          </div>

          <div className="right-column">
          {this.showForm()}
            </div>
        </div>
    )
  }
}

export default Calendar;

