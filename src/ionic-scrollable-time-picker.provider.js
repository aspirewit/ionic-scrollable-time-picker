angular.module('ionic-scrollable-time-picker.provider', [])

  .provider('ionicScrollableTimePicker', function () {

    var defaults = {
      setButtonText: 'Set',
      closeButtonText: 'Close',
      format: 24
    };

    var twelveHours = [
      '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'
    ];

    var twentyFourHours = [
      '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11',
      '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'
    ];

    var minutes = [
      '00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
      '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
      '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
      '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
      '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
      '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'
    ];

    this.configTimePicker = function (options) {
      angular.extend(defaults, options);
    };

    this.$get = ['$rootScope', '$ionicPopup', function ($rootScope, $ionicPopup) {

      var provider = {};
      var $scope = $rootScope.$new();

      var isTwelveHourClock = function() {
        return $scope.configs.format === 12;
      };

      var getHours = function() {
        return isTwelveHourClock() ? twelveHours : twentyFourHours;
      };

      var paddingZero = function(number, width) {
        var result = String(number);

        var size = result.length;
        width = Number(width || 2);
        if (width != NaN && width > size) {
          result = Array(width - size + 1).join(0) + number;
        }

        return result;
      };

      var timeRemap = function() {
        var date = $scope.configs.initialDate = $scope.configs.initialDate || new Date();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var time = {};

        if (isTwelveHourClock()) {
          if (hour > 12) {
            hour -= 12;
            time['meridian'] = 'PM';
          } else {
            time['meridian'] = 'AM';
          }
        }

        time['hour'] = paddingZero(hour);
        time['minute'] = paddingZero(minute);
        return time;
      };

      provider.openTimePicker = function (options) {
        $scope.configs = angular.extend({}, defaults, options);

        $scope.hours = getHours();
        $scope.minutes = minutes;
        $scope.time = timeRemap();

        var buttons = [];
        buttons.push({
          text: $scope.configs.setButtonText,
          type: 'button_set',
          onTap: function (e) {
            $scope.time.hour = Number($scope.time.hour);
            $scope.time.minute = Number($scope.time.minute);

            if (isTwelveHourClock()) {
              if ($scope.time.meridian == 'PM' && $scope.time.hour != 12) {
                $scope.time.hour += 12;
              } else if ($scope.time.meridian == 'AM' && $scope.time.hour == 12) {
                $scope.time.hour -= 12;
              }
            }

            var date = $scope.configs.initialDate;
            date.setHours($scope.time.hour, $scope.time.minute, 0);
            $scope.configs.callback(date);
          }
        });

        buttons.push({
          text: $scope.configs.closeButtonText,
          type: 'button_close'
        });

        $scope.popup = $ionicPopup.show({
          templateUrl: 'ionic-scrollable-time-picker.html',
          scope: $scope,
          cssClass: 'ionic-scrollable-time-picker',
          buttons: buttons
        });

      };

      return provider;

    }];

  });
