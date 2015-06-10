torScoreApp.directive('reportFields', ['$state', '$rootScope', '$modal', '$log', '$timeout', '$stateParams', function ($state, $rootScope, $modal, $log, $timeout, $stateParams) {
    return {
        restrict: 'E',
        templateUrl: './components/categoryReport/reportFields.html',
        link: function (scope, el, attrs) {
            //fieldsTypeMap: 1: input,  2: dropdown,   3: toggle
            $rootScope.catFieldsData = "";
            $rootScope.showLoader = true;
            scope.meatDisable = false;
            scope.fishDisable = false;
            scope.setDataByActiveCat = function () {
                if ($rootScope.activeCategory.id) {
                    $rootScope.catFieldsData = fields[$rootScope.activeCategory.id.toString()]
                }


            }
            scope.setDataByActiveCat();

            scope.oneAtATime = true;

            scope.optionSelected = function (index, parentIndex, event) {

                //get the current accordion index
                var accordionIndex = $(event.target).parents('.accordion-parent').attr('data-id');
                //remove other selected class
                $($(".accordion-parent")[accordionIndex]).find(".option").removeClass("selected")
                //add the selected class - to the 'option' class. if it the target or the target parent
                if ($(event.target).parent(".option").length > 0) {
                    $(event.target).parent(".option").addClass('selected');
                }
                else {
                    $(event.target).addClass('selected');
                }

                //remove the not-valid class - if exist
                $($(".accordion-parent")[accordionIndex]).removeClass('not-valid')

                //get the parent item (by parent index)
                var currentField = $rootScope.catFieldsData.fields[parentIndex]
                //set the selected option
                currentField.selectedIndex = index;

                //if the category is עמדת שף  
                // the user can choose איכות בשר או איכות דגים and not both
                if ($rootScope.activeCategory.id == 10) {
                    //if the category is meat
                    if (currentField.id == 120) {
                        //$rootScope.catFieldsData[index+1]
                        scope.fishDisable = true;
                        scope.meatDisable = false;

                        //init the selectedIndex - of the other field - 121 (by the index location)
                        $rootScope.catFieldsData.fields[parentIndex + 1].selectedIndex = -1;
                    }
                    else if (currentField.id == 121) {
                        scope.meatDisable = true;
                        scope.fishDisable = false;

                        //init the selectedIndex- of the other field - 120 (by the index location)
                        $rootScope.catFieldsData.fields[parentIndex - 1].selectedIndex = -1;
                    }
                }
                //if the category is פחמימות בבר ירקות  
                // אם המשתמש סמן שיש קטניה, אז הדיפולט של חלבון צריך להשתנות ל8-15 גר
                if ($rootScope.activeCategory.id == 28) {
                    //אם מסודבר בשדה של קטניה
                    if (currentField.id == 118) {
                        //if the selected item is יש קטניה
                        if (currentField.options[currentField.selectedIndex].id == 25) {
                            //update the default of תכולת חלבון
                            var helbonItem = $rootScope.catFieldsData.fields[parentIndex + 2]
                            //if its realy helbon field
                            if (helbonItem.id == 119) {
                                 $rootScope.catFieldsData.fields[parentIndex + 2].selectedIndex = 1
                            }

                        }
                        //init the default to the standart
                            //כמו במצב ההתחלתי כאשר אין קטנית
                        else{
                            //update the default of תכולת חלבון
                            var helbonItem = $rootScope.catFieldsData.fields[parentIndex + 2]
                            //if its realy helbon field
                            if (helbonItem.id == 119) {
                                 $rootScope.catFieldsData.fields[parentIndex + 2].selectedIndex = 0
                            }
                        }

                    }
                }

            }
            scope.getSelectedItem = function (singleFieldData) {
                for (var i = 0; i < singleFieldData.options.length; i++) {
                    if (singleFieldData.options[i].isDefault == true) {
                        return i;
                    }
                }
                return -1;
            }
            //on init- set the default values by selected field
            scope.setSelectedIndexes = function (index) {
                //fields[activeCategory.id].fields
                var currentField = $rootScope.catFieldsData.fields[index];
                currentField.selectedIndex = scope.getSelectedItem(currentField)


            }

            //the V btn click- end report
            scope.endReport = function (type) {
                var thereAreNOtValidFields = false;
                //check the required fields
                //check all the fields and add class for the fields that required
                for (var i = 0; i < $(".accordion-parent").length; i++) {
                    //if this is required field and....
                    if ($rootScope.catFieldsData.fields[i].isRequired == true) {

                        //if the current field has no selected option 
                        if ($rootScope.catFieldsData.fields[i].selectedIndex == -1) {
                            $($(".accordion-parent")[i]).addClass('not-valid');
                            thereAreNOtValidFields = true;
                        }

                    }
                }
                //if there are no required fields to fill - success and clear the page
                if (thereAreNOtValidFields == false) {
                    alert("הדיווח נשמר בהצלחה!");
                    //save the data - locally
                    scope.saveDataLocally();


                    //init activeCategory
                    $rootScope.activeCategory = -1;
                    //init camera pictures - if need
                    $rootScope.$broadcast('endReport', { type: type });
                }

            }

            scope.getClassRequiredByAnother = function (field, index) {
                //אם השדה הוא חובה בתנאי שקיים שדה אחר- הוא נהפך לשדה חובה
                if (field.isRequiredByAnother) {
                    if (scope.catFieldsData.fields[index - 1].selectedIndex == 1 || scope.catFieldsData.fields[index - 1].selectedIndex == 1)
                        return true;
                }
            }
            scope.goToSummary = function () {
                $state.transitionTo('summary');
            }
            scope.saveDataLocally = function () {
                var allDataObj;
                //set on local storage
                if (localStorage.getItem('summaryData') && localStorage.getItem('summaryData') !="") {
                    allDataObj = JSON.parse(localStorage.getItem('summaryData'));

                }
                else {
                    allDataObj = {}
                }

                //   $rootScope.fullReports;
                var id = $rootScope.catFieldsData.id.toString();
                //$rootScope.fullReports.mealId = scope.mealId;
                allDataObj.mealId = scope.mealId;
                //if this category have no array  -  create an array
                if (!allDataObj[id]) {
                    allDataObj[id] = {}
                    //$rootScope.fullReportsz
                    allDataObj[id].reportItems = new Array();
                    allDataObj[id].id = $rootScope.catFieldsData.id;
                    allDataObj[id].mainComment = $rootScope.catFieldsData.mainComment;
                    allDataObj[id].name = $rootScope.catFieldsData.name;
                }
                var allData = jQuery.extend(true, {}, $rootScope.catFieldsData)
                var relevantData = {}
                relevantData.id = allData.id;
                relevantData.reportSubjectName = allData.fields[0].options[allData.fields[0].selectedIndex].name
                allDataObj[id].reportItems.push(relevantData)
                localStorage.setItem('summaryData', JSON.stringify(allDataObj))


                //init local
                $rootScope.catFieldsData = {}


            }
            //if the category is עמדת שף  
            // the user can choose איכות בשר או איכות דגים and not both
            //איכות דגים id:121
            //איכות בשר ועוף id:120
            scope.isDisable = function (field, index) {
                //if this is עמדת שף
                if ($rootScope.activeCategory.id == 10) {
                    //if the category is meat
                    if (field.id == 120) {
                        //$rootScope.catFieldsData[index+1]
                        return scope.meatDisable;
                    }
                    else if (field.id == 121) {
                        return scope.fishDisable;
                    }
                }
            }
        },
        replace: true
    };


} ]);


