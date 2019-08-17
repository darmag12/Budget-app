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

            // push the new item into the data structure
            data.allItems[type].push(newItem);
            // return the new element
            return newItem;
        },

        testing: function(){
            console.log(data)
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
        addBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    }

    return {
        getInput: function (){
            return{
                type: document.querySelector(domStrings.inputType).value,// will be either inc or exp
                description: document.querySelector(domStrings.inputDescription).value,
                value: parseFloat(document.querySelector(domStrings.inputValue).value)
            };
        },

        addListItems: function (obj, type){
            var html, newHtml, element;
            if(type === 'inc'){
                element = document.querySelector(domStrings.incomeContainer);
                // create html string with placeholder text
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = document.querySelector(domStrings.expenseContainer);
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            // replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value)

            // insert html into the DOM
            element.insertAdjacentHTML('beforeend', newHtml);
        },

        clearField: function (){
            var fields, fieldsArr;

            fields = document.querySelectorAll(`${domStrings.inputDescription}, ${domStrings.inputValue}`);

            fieldsArr = Array.from(fields);
            fields.forEach(function(current, index, array){
                current.value = '';
            });
            // this ensures the cusor goes back to the description after a submition
            fieldsArr[0].focus();
        },

        getDomStrings: function (){
            return domStrings;

        }
    }
})();





// GLOBAL APP CONTROLLER
// controlls the entire app and acts as a link between the above modules
var controller = (function (budgetCtr, uICtr){

    // responsible for all event listeners
    var setUpEventListeners = function (){

        // passed the dom strings to the app controller, through getDomStrings() and stored them in the DOM variable.
        var DOM = uICtr.getDomStrings();

        document.querySelector(DOM.addBtn).addEventListener('click', ctrAddItem);

        document.addEventListener('keypress', function(event){
        
            if (event.keyCode === 13 || event.which === 13){
                ctrAddItem()
            };
        });
    }

    var updateBudget = function (){
         // 1. calculate the budget 

         // 2. return the budget

        // 3. display the budget on the UI

        
    }

    var ctrAddItem = function (){
        var input, newItem;
        // 1. get the input value on the field
            input = uICtr.getInput()

        if (input.description !== '' && !isNaN(input.value) && input.value > 0){
            // 2. add the item to the budget controller
                newItem = budgetCtr.addItem(input.type, input.description, input.value);
            // 3. add the item to the UI
                uICtr.addListItems(newItem, input.type);
    
            // 4. clear the fields
                uICtr.clearField()
    
            // 5. calculate and update budget 
             updateBudget()

        } else {
            alert('Hey please make sure your input fields are not empty and that your value is greater than 0');
        }
    }

    return{
        // method for initializing the application
        init: function (){
            setUpEventListeners();
            console.log('Application has started')
        }
    }

    
})(budgetController, uIController);

controller.init();