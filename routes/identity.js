var express = require('express');
var router = express.Router();
var Auth0Client = require('../lib/auth0Client');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('identity', { title: 'register mobile identity' });
});

router.post('/', (req,res,next)=>{
  
  let client = new Auth0Client({
      domain: 'pkr.auth0.com',
      connection: 'agl',
      clientId: "OX4BMyrxG84K8U1QTkrPyJHO7ukHjcnd",
      clientSecret: 'SeZ-8453x4B2YWDkvzZvmjcgLnbQxm98L7OahXJpih2S_PGNhA00rAJJM5jVI7xx'
  });

  client.createUserAsync(
    {
      phone: req.body.phone, 
      email: `${req.body.password}@gmail.com`, 
      password: req.body.password
    })
    .then( _ => client.startPasswordless({phone: req.body.phone})
                .then( _ => res.redirect('verify'))
                .catch(err=>next(err)))
    .catch(err=>next(err));
});


router.get('/verify', function(req, res, next) {
  res.render('verify', { title: 'verify identity' });
});


router.post('/verify', function(req, res, next) {
  console.log(req.body);
  res.render('verify', { title: 'verify identity' });
});


module.exports = router;
