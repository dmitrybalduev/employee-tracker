const inquirer = require("inquirer")
const mysql = require("mysql");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employeesDB',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    start();
  });


function start() {
    inquirer.prompt([
        {
            type: "list",
            name: "answer",
            message: "What would you like to do?",
            choices: [
                "View all employees",
                "View all employees by department",
                "Add employee",
                "Update employee role",
                "View all roles",
                "Add role",
                "View all departments",
                "Add department",
                "Exit"
            ]
        },
    ])
        .then(function (data) {
            switch (data.answer) {
                case "View all employees":
                case "View all employees by department":
                case "View all employess by manager":
                case "View all roles":
                case "View all departments":
                    renderView(data.answer);
                    break;

                case "Add employee":
                case "Add role":
                case "Add department":
                    renderAdd(data.answer);
                    break;

                case "Remove employee":
                case "Remove role":
                    renderRemove(data.answer);
                    break;

                case "Update employee role":
                case "Update employee manager":
                    renderUpdate(data.answer);
                    break;
                    
                case "Exit":
                    process.exit(-1);
            }
        })
}


function renderView(selection) {
    switch (selection) {
        case "View all employees":
        case "View all roles":
        case "View all departments":
            selectQuery(selection.split(" ")[2]);
            break;
        case "View all employees by department":
            viewByDepartment();
            break;
    }    
}

function selectQuery(table){
    let query = "SELECT * FROM " + table;
    if(table === "employees"){
        query = `select e.id, e.first_name, e.last_name, r.title, r.salary
        from employees e
        join roles r on
        e.role_id = r.id;`
    }
    connection.query(query, (err, res) => {
        if (err) throw err;
        
        console.log();
        console.table(res);
        start();
      });
}

function viewByDepartment(){
    let query = "SELECT name FROM departments";
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "answer",
                message: "Please choose one",
                choices: res
            }
        ]).then(function (data){
            const query2 = `select e.first_name, e.last_name, r.title, d.name AS department_name from employees e 
            join roles r on 
            e.role_id = r.id
            join departments d on
            r.department_id = d.id
            WHERE d.name = '${data.answer}'`;
            connection.query(query2, (err, res) => {
                if (err) throw err;
                console.log();
                console.table(res);
                start();
              });
        })
      });
};

function renderAdd(add) {
    add = add.split(" ")[1];
    switch (add) {
        case "employee":
            addEmployee()
            break;
        case "department":
            addDepartment()
            break;
        case "role":
            addRole()
            break;
    }
}

function addDepartment() {
    inquirer.prompt([
        {
            message: "Please provide name for new department",
            name: "userChoice"
        }
    ])
        .then(function (data) {
            const query = connection.query(
                'INSERT INTO departments SET ?',
                {
                  name: data.userChoice
                },
                (err, res) => {
                  if (err) throw err;
                  console.log("Added successfully!");
                  start();
                }
              );
        })
}

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "Please provide employee's first name"
        },
        {
            type: "input",
            name: "last_name",
            message: "Please provide employee's last name"
        },
        {
            type: "input",
            name: "role_id",
            message: "What is the employee's role id?"
        },
        {
            type: "input",
            name: "manager_id",
            message: "What is the employee's manager id?"
        }
    ])
        .then(function (data) {
            const query = connection.query(
                'INSERT INTO employees SET ?',
                {
                  first_name: data.first_name,
                  last_name: data.last_name,
                  role_id: data.role_id,
                  manager_id: data.manager_id,
                },
                (err, res) => {
                  if (err) throw err;
                  console.log("Added successfully!");
                  start();
                }
              );
        })
}

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Please provide role name"
        },
        {
            type: "input",
            name: "salary",
            message: "Please provide role's salary"
        },
        {
            type: "input",
            name: "department_id",
            message: "Please provide role's department id"
        }
    ])
        .then(function (data) {
            const query = connection.query(
                'INSERT INTO roles SET ?',
                {
                  title: data.title,
                  salary: data.salary,
                  department_id: data.department_id,
                },
                (err, res) => {
                  if (err) throw err;
                  console.log("Added successfully!");
                  start();
                }
              );
        })
}


function renderUpdate(choice) {
    switch(choice){
        case "Update employee role":
            choice = "roles";
            break;
        case "Update employee manager":
            break;
    }

    let arrEmployees = [];
    let query = "SELECT first_name, last_name FROM employees";
    connection.query(query, (err, resEmp) => {
        if (err) throw err;
        for(let i = 0; i < resEmp.length; i++){
            arrEmployees.push(resEmp[i].first_name + " " + resEmp[i].last_name);
        }
        let arrRoles = [];
        let query2 = "SELECT title FROM roles";
        connection.query(query2, (err, res) => {
            if (err) throw err;
            for(let i = 0; i < res.length; i++){
                arrRoles.push(res[i].title);
            }
            updateEmployeeRole(arrEmployees, arrRoles);
          });
      });

}

 function updateEmployeeRole(arrEmpl, arrAllRoles){
    console.log(arrEmpl);
    console.log(arrAllRoles);
    inquirer.prompt([
        {
            type: "list",
            name: "empl",
            message: "Please choose employee you'd like to update",
            choices: arrEmpl,
        },
        {
            type: "list",
            name: "role",
            message: "Please choose new role for employee",
            choices: arrAllRoles,
        }
    ])
    .then(function (data) {
        let query = `UPDATE employees SET role_id = (SELECT id FROM roles WHERE ?) WHERE ? AND ?;`;
        connection.query(query, 

            [{title: data.role},
            {first_name: data.empl.split(" ")[0]},
            {last_name: data.empl.split(" ")[1]}], (err, res) => {
                if (err) throw err;
                console.log("Updated Successfully!");
                start();
            });
    });
}
