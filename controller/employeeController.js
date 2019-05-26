const express = require('express');
const mongoose = require('mongoose');
const Employee = mongoose.model('mongoose');
var  router = express.Router();

router.get('/', (req,res)=>{
    res.render("employee/addoredit",{
        viewTitl: "Insert Employee"
    });
});

router.post('/',(req,res)=>{
    InsertRecord(req,res);
});

function InsertRecord(req,res){
    var employee = new Employee();
    employee.fullname = req.body.fullname;
    employee.email = req.body.email;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
    employee.save((err,doc)=> {
    if (!err)
        res.redirect('employee/list');
    else {
        if (err.name == 'ValidationError') {
            handleValidationError(err, req.body);
            res.render("employee/addOrEdit", {
                viewTitle: "Insert Employee",
                employee: req.body
            });
        }
        else
            console.log('Error during record insertion : ' + err);
    }
});
}

router.get('/list', (req,res)=>{
    Employee.find((err,docs)=>{
        if (!err){
              res.render("employee/list",{
              list: docs
              });     
        }
        else{
            console.log("error" + err);
        }
    });
});

function handleValidationError(err,body){
    for(field in err.errors)
    {
        switch (err.errors[field].path) {
            case 'fulname':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req,res)=>{
    Employee.findById(req.param.id, (err,doc)=>{
        if(!err) {
            res.render("employee/addoredit",{
                viewTitle: "Update Employee",
                employee : doc
            });
        }
        else{
            console.log('Err' + err);
        }
    });
});
module.exports = router;