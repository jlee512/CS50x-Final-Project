/**
 * Created by julian on 5/09/2017.
 */

function DatePicker() {
    //When constructed, create a new current datetime object and populate as default 'selected' variables
    var d = new Date();

    //Static month variables
    var months = [{"name": "January", "max_days": 31}, {"name": "February", "max_days": 28}, {
        "name": "March",
        "max_days": 31
    }, {"name": "April", "max_days": 30}, {"name": "May", "max_days": 31}, {
        "name": "June",
        "max_days": 30
    }, {"name": "July", "max_days": 31}, {"name": "August", "max_days": 31}, {
        "name": "September",
        "max_days": 30
    }, {"name": "October", "max_days": 31}, {"name": "November", "max_days": 30}, {"name": "December", "max_days": 31}];

    //Setup user selection variables
    this.selected_day = d.getDate();
    this.selected_month = d.getMonth();
    this.selected_year = d.getFullYear();

    //Setup input field variables and set initial values in the HTML document
    this.day_input = $('#day');
    this.month_input = $('#month');
    this.year_input = $('#year');
    this.leap_year_input = $('#leap-year');

    //Method for updating all displayed input fields
    this.update_input_attr_val = function () {
        //Set HTML day_input 'max' accordingly
        this.day_input.attr('max', this.max_month_day);
        //Set HTML day/month/year/leap_year_input values accordingly
        this.day_input.val(this.selected_day);
        this.month_input.val(months[this.selected_month].name);
        this.year_input.val(this.selected_year);
        this.leap_year_input.val(this.leap_year);
    };

    //Method for checking leap year status
    this.check_leap_year = function () {
        this.leap_year = (this.selected_year % 4) === 0;
    };
    //Call this method initially when constructed
    this.check_leap_year();

    //Method to check the maximum day for a given month (factoring in leap years and month-to-month variation)
    this.calc_max_month_day = function () {
        //Function to calculate maximum allowable day within the month (adapting February for leap years)
        if (this.leap_year && this.selected_month === 1) {
            this.max_month_day = 29;
        } else {
            this.max_month_day = months[this.selected_month].max_days;
        }
    };

    //Method for checking a given day relative to the maximum allowable day for a given month and update private variables accordingly
    this.check_max_day = function () {
        this.calc_max_month_day();
        if (this.selected_day > this.max_month_day) {
            this.selected_day = this.max_month_day;
        }
        // this.update_input_attr_val();
    };
    //Call the check_max_day and update_input_attr_val methods initially when constructed
    this.check_max_day();
    this.update_input_attr_val();

    //Method used to check the current day and year input values
    this.check_input_values = function () {
        this.selected_day = this.day_input.val();
        this.selected_year = this.year_input.val();
        this.check_leap_year();
        this.check_max_day();
        // this.update_input_attr_val();
    };

    this.increment_day = function () {
        this.selected_day++;
        if (this.selected_day > this.max_month_day) {
            this.selected_day = 1;
        }
    };

    this.decrement_day = function () {
        this.selected_day--;
        if (this.selected_day < 1) {
            this.selected_day = this.max_month_day;
        }
    };

    this.increment_month = function () {
        this.selected_month++;
        if (this.selected_month > 11) {
            this.selected_month = 0;
        }
        this.check_max_day();
    };

    this.decrement_month = function () {
        this.selected_month--;
        if (this.selected_month < 0) {
            this.selected_month = 11;
        }
        this.check_max_day();
    };

    this.increment_year = function () {
        this.selected_year++;
        if (this.selected_year > 2500) {
            this.selected_year = 1900;
        }
        this.check_leap_year();
        this.check_max_day();
    };

    this.decrement_year = function () {
        this.selected_year--;
        if (this.selected_year < 1900) {
            this.selected_year = 2500;
        }
        this.check_leap_year();
        this.check_max_day();
    };

    //Animation functions
    //DAY ANIMATION
    this.day_rotate_animation = function () {
        var self = this;
        this.day_input.addClass('rotate');
        //Add callback for when rotation transition is over
        this.day_input.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
            self.day_input.removeClass('rotate');
            self.update_input_attr_val();
        });
    };

    this.day_reverse_rotate_animation = function () {
        var self = this;
        this.day_input.addClass('reverse-rotate');
        //Add callback for when rotation transition is over
        this.day_input.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
            self.day_input.removeClass('reverse-rotate');
            self.update_input_attr_val();
        });
    };

    //MONTH ANIMATION
    this.month_rotate_animation = function () {
        var self = this;
        this.month_input.addClass('rotate');
        //Add callback for when rotation transition is over
        this.month_input.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
            self.month_input.removeClass('rotate');
            self.update_input_attr_val();
        });
    };

    this.month_reverse_rotate_animation = function () {
        var self = this;
        this.month_input.addClass('reverse-rotate');
        //Add callback for when rotation transition is over
        this.month_input.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
            self.month_input.removeClass('reverse-rotate');
            self.update_input_attr_val();
        });
    };

    //YEAR ANIMATION
    this.year_rotate_animation = function () {
        var self = this;
        this.year_input.addClass('rotate');
        //Add callback for when rotation transition is over
        this.year_input.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
            self.year_input.removeClass('rotate');
            self.update_input_attr_val();
        });
    };

    this.year_reverse_rotate_animation = function () {
        var self = this;
        this.year_input.addClass('reverse-rotate');
        //Add callback for when rotation transition is over
        this.year_input.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
            self.year_input.removeClass('reverse-rotate');
            self.update_input_attr_val();

        });
    };
}

$(document).ready(function () {
    //Initialize datepicker instance
    var datepicker = new DatePicker();

    //Implement core function of datepicker front-end (clicking, holding or changing with keypress)
    $('#increase-day').on('click', function () {
        datepicker.day_rotate_animation();
        datepicker.increment_day();
    });

    $('#reduce-day').on('click', function () {
        datepicker.day_reverse_rotate_animation();
        datepicker.decrement_day();
    });

    //Additional event handler for changing day to account for keypress
    $('#day').on('change', function () {
        datepicker.check_input_values();
    });

    $('#increase-month').on('click', function () {
        datepicker.month_rotate_animation();
        datepicker.increment_month();
    });

    $('#reduce-month').on('click', function () {
        datepicker.month_reverse_rotate_animation();
        datepicker.decrement_month();
    });

    //Add in custom up/down keypress actions to months (text input)
    $('#month').keydown(function (event) {
        if (event.keyCode == 38) {
            datepicker.increment_month();
        } else if (event.keyCode == 40) {
            datepicker.decrement_month();
        }
    });

    $('#increase-year').on('click', function () {
        datepicker.year_rotate_animation();
        datepicker.increment_year();
    });

    $('#reduce-year').on('click', function () {
        datepicker.year_reverse_rotate_animation();
        datepicker.decrement_year();
    });

    //Additional event handler for changing year to account for keypress
    $('#year').on('change', function () {
        datepicker.check_input_values();
    });
});