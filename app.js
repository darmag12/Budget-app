// BUDGET CONTROLLER
// takes care of internal data manipulation
var budgetController = (function(){

    var Expense = function (id, description, value){
        this.id = id,
        this.description = description,
        this.value = value,
        this.percentage = -1
    }
    // Expense constuctor methods
    Expense.prototype.calculatePercentage = function (totalInc){
        if (totalInc > 0){
            this.percentage = Math.round((this.value / totalInc) * 100);
        } else {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function (){
        return this.percentage;
    }
    //////////===========================================================//////////


    var Income = function (id, description, value){
        this.id = id,
        this.description = description,
        this.value = value
    }

    var calculateTotal = function (type){
        var sum = 0;
        data.allItems[type].forEach(function (curr){
            sum += curr.value;
        });
        data.totals[type] = sum;
    }


    var data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        },

        budget: 0,
        percentage: -1
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

        deleteItem: function(type, id){
            var ids, index;
            ids = data.allItems[type].map(function(curr){
                return curr.id;

            });
            index = ids.indexOf(id);
            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function (){
            // 1. calculate total income and expenses
                calculateTotal('exp');
                calculateTotal('inc');

            // 2. calculate the budget: income - expenses
                data.budget = data.totals.inc - data.totals.exp;

            // 3. calculate percentage of the spent income
                if (data.totals.inc > 0){
                    
                    data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
                } else{
                    data.percentage = -1;
                }
        },   
        
        getBudget: function (){
            return{
                budget: data.budget,
                percentage: data.percentage,
                totalExp: data.totals.exp,
                totalInc: data.totals.inc
            }
        },

        calcPercentages: function (){
            data.allItems.exp.forEach(function(curr){
                curr.calculatePercentage(data.totals.inc);
            })
        },

        getPercentages: function (){
            var allPerc = data.allItems.exp.map(function(curr){
                return curr.getPercentage();
            });
            return allPerc;
        },

        testing: function(){
            console.log(data)
        }

        
    }

})();




//==========================================================================================//





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
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        expensesPercentage: '.budget__expenses--percentage',
        container: '.container',
        itemPercLabel: '.item__percentage'
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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = document.querySelector(domStrings.expenseContainer);
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            // replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value)

            // insert html into the DOM
            element.insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItems: function (selectorID){
            var el;
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
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

        displayBudget: function(obj){
            if(obj.budget > 0){
                document.querySelector(domStrings.budgetLabel).textContent = '+ ' + obj.budget
            } else {
                document.querySelector(domStrings.budgetLabel).textContent = obj.budget
            }
            document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc
            document.querySelector(domStrings.expensesLabel).textContent = obj.totalExp

            if(obj.percentage > 0){

                document.querySelector(domStrings.expensesPercentage).textContent = obj.percentage + '%'
            } else{
                document.querySelector(domStrings.expensesPercentage).textContent = '---'
            }
        },

        displayPercentages: function (percentages){

            var fields = document.querySelectorAll(domStrings.itemPercLabel);

            var nodeListForEach = function (list, callback){
                for(var i = 0; i < list.length; i++){
                    callback(list[i], i)
                }
            }

            nodeListForEach(fields, function(current, index){
                current.textContent = percentages[index] + '%';
            });
        },

        getDomStrings: function (){
            return domStrings;

        }
    }
})();




//===========================================================================================//





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

        document.querySelector(DOM.container).addEventListener('click', ctrDeleteItem);
    }



    var updateBudget = function (){
         // 1. calculate the budget 
            budgetCtr.calculateBudget();
         // 2. return the budget
            var budget = budgetCtr.getBudget()

        // 3. display the budget on the UI
            uICtr.displayBudget(budget)
        
    }

    var updatePercentages = function(){
        // 1. calculate percentages
            budgetCtr.calcPercentages();

        // 2. get the percentages from the budget controller
            var percentages = budgetCtr.getPercentages();

        // 3. update the UI with the new percentages
            console.log(percentages);
    }

    var ctrAddItem = function (){
        var input, newItem;
        // 1. get the input value on the field
            input = uICtr.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0){
            // 2. add the item to the budget controller
                newItem = budgetCtr.addItem(input.type, input.description, input.value);
            // 3. add the item to the UI
                uICtr.addListItems(newItem, input.type);
    
            // 4. clear the fields
                uICtr.clearField();
    
            // 5. calculate and update budget 
             updateBudget();

             // 6. calculate and update percentages
             updatePercentages();

        } else {
            alert('make sure your input fields are not empty and that your value is greater than 0');
        }
    }

    var ctrDeleteItem = function (event){
        var itemID, splitID, type, ID;
       itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
       if (itemID){
           // the split method splits strings into individual items in an array
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
           // delete the item from the data structure
            budgetCtr.deleteItem(type, ID);

           // delete the item from the UI
            uICtr.deleteListItems(itemID);
           // update and show the new budget
            updateBudget();

            // calculate and update percentages
            updatePercentages();
       }
       
    }

    return{
        // method for initializing the application
        init: function (){
            setUpEventListeners();
            console.log('Application has started')
            // resets everything to 0
            uICtr.displayBudget({
                budget: 0,
                percentage: -1,
                totalExp: 0,
                totalInc: 0
            })
        }
    }

    
})(budgetController, uIController);

controller.init();