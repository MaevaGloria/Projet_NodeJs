const express = require('express');
const mysql = require('mysql');
const myConnection = require('express-myconnection');

const optionBd = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 3306,
  database: 'node_bd',
}

const app = express();
const path = require('path');

//Definition du middleware 
app.use(myConnection(mysql, optionBd, 'pool'))

app.set('view engine', 'ejs');
app.set('views', './FileHTML');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/acceuil', (req, res) => {
  const titre = 'Accueil';

  req.getConnection((erreur, connection)=>{
    if(erreur){
      console.log(erreur);
    }else{
      connection.query('SELECT * FROM departements', [], (erreur, departement)=>{
        if(erreur) {
          console.log(erreur);
        }else {
          connection.query('SELECT * FROM caroussel', [], (erreur, carrousel)=>{
            if(erreur) {
              console.log(erreur);
            }else {
              connection.query('SELECT * FROM bienvenue', [], (erreur, welcome)=>{
                if(erreur) {
                  console.log(erreur);
                }else {
                  connection.query('SELECT * FROM partenaires', [], (erreur, patners)=>{
                    if(erreur) {
                      console.log(erreur);
                    }else {
                      res.status(200).render("accueil", { 
                        titre,
                        departement,
                        carrousel,
                        welcome,
                        patners });
                      }
                    });
                  }
                });
            }
          });
        }
      });
    }
  });
});

app.get('/departement/:id', (req, res) => {
  const id = req.params.id;
  const titre = 'Département';

  req.getConnection((erreur, connection) => {
    if (erreur) {
      console.log(erreur);
    } else {
      connection.query('SELECT * FROM departements WHERE id = ?', [id], (erreur, resultats) => {
        if (erreur) {
          console.log(erreur);
        } else if (resultats.length === 0) {
          res.status(404).render('erreur', { titre: 'Erreur 404' });
        } else {
          const departement = resultats[0]; // Un seul département
          res.status(200).render('departement', { titre, departement });
        }
      });
    }
  });
});

// app.get('/apropos', (req, res) => {
//   res.status(200).sendFile("FileHTML/apropos.html", { root: __dirname });
// });

app.get('/inscription', (req, res) => {
  const titre = 'Inscription';
  res.status(200).render('inscription', {titre})
});

app.get('/connexion', (req, res) => {
  const titre = 'Connexion';
  res.status(200).render('connexion', {titre})
});

app.get('/', (req, res) => {
  res.status(300).redirect('/acceuil');
}); 

app.use((req, res) => {
  const titre = 'Erreur 404';
 res.status(404).render('inscription', {titre})
});

app.listen(3000, () => {
  console.log("En attente des requetes du port 3000");
});
// console.log('Erreur lors de la création du serveur');


