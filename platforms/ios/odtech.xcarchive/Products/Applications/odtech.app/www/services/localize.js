

odtechApp.factory('localize', ['$http', '$rootScope', '$window', '$filter', function ($http, $rootScope, $window, $filter) {
    var localize = {
        dictionary: [],
        resourceFileLoaded: false,
        successCallback: function (data) {
            // store the returned array in the dictionary
            localize.dictionary = data;
            localize.resourceFileLoaded = true;
        },

        initLocalizedResources: function () {
            $rootScope.dic = $rootScope.isEnglish ? englishDic : hebrewDic;
            //  var isEnglish = false;
            var stringsFile = $rootScope.isEnglish ? './strings/resources-locale_en-US.js' : './strings/resources-locale_default.js';
            console.log(stringsFile);
            $http.get(stringsFile).success(function (result) {
                localize.successCallback(result);
            })
                .error(function () {
                    console.log('couldnt load the file');
                });
        },

        getLocalizedString: function (value) {
            // default the result to an empty string
            var result = '';
            if (!localize.resourceFileLoaded) {
                localize.initLocalizedResources();
                localize.resourceFileLoaded = true;
                return result;
            }
            // make sure the dictionary has valid data
            if ((localize.dictionary !== []) && (localize.dictionary.length > 0)) {
                var entry = $filter('filter')(localize.dictionary, function (item) { return item.key == value; })[0];
                if ((entry !== null) && (entry != undefined)) {
                    result = entry.value;
                }
            }
            return result;
        }

    };
    return localize;
} ]);
