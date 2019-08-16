// BUDGET CONTROLLER
// takes care of internal data manipulation
var budgetController = (function(){

    var Expense = function (id, description, value){
        this.id = id,
        this.description = description,
        this.value = value
    }

    var Income = function (id, description, value){
        this.id = id,
        this.description = description,
        this.value = value
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        }
    }

    return{
        addItem: function (type, des, val){
            var newItem, ID;
            
            if(data.allItems[type].length > 0){
                // create new id
                // this is simply inc/exp[inc/exp.length-1].id + 1
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                
            } else{
                ID = 0;
            }

            // create a new item based on 'inc' or 'exp' type
            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            // push the new item into our data structure
            data.allItems[type].push(newItem);
            // return the new element
            return newItem;
        },

        testing: function (){
            console.log(data);
        }
    }

})();





//UI CONTROLLER
// takes care of rendering data to the ui
var uIController = (function(){
    // holds all strings for dom manipulations
    var domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn'
    }

    return {
        getInput: function (){
            return{
                type: document.querySelector(domStrings.inputType).value,// will be either inc or exp
                description: document.querySelector(domStrings.inputDescription).value,
                value: document.querySelector(domStrings.inputValue).value
            };
        },

        getDomStrings: function (){
            return domStrings;

        }
    }
})();





// // GLOBAL APP CONTROLLER
// // controlls the entire app and acts as a link between the above modules
// var controller = (function (budgetCtr, uICtr){

//     // responsible for all event listeners
//     var setUpEventListeners = function (){

//         // passed the dom strings to the app controller, through getDomStrings() and stored them in the DOM variable.
//         var DOM = uICtr.getDomStrings();

//         document.querySelector(DOM.addBtn).addEventListener('click', ctrAddItem);

//         document.addEventListener('keypress', function(event){
        
//             if (event.keyCode === 13 || event.which === 13){
//                 ctrAddItem()
//             };
//         });
//     }

//     var ctrAddItem = function (){
//         var input, newItem;
//         // 1. get the input value on the field
//             input = uICtr.getInput()
        
//         // 2. add the item to the budget controller
//             newItem = budgetCtr.addItem(input.type, input.description, input.value);
//         // 3. add the item to the UI

//         // 4. calculate the budget 

//         // 5. display the budget on the UI
//     }

//     return{
//         // method for initializing the application
//         init: function (){
//             setUpEventListeners();
//             console.log('Application has started')
//         }
//     }

    
// })(budgetController, uIController);

// controller.init();