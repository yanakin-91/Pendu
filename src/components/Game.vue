<template>
	<div class="container">
		<h1 class="text-center">Le jeux du pendu</h1>
		<div class="input-group mb-3">
  			<select class="custom-select" id="category" @change="init">
  				<option value="0">Choisir le théme du jeu</option>
    			<option v-for="category in categories" :value="category">{{ category }}</option>
  			</select>
		</div>
		<div v-show="visible">
			<div class="d-flex justify-content-center">
				<button class="btn btn-success text-center" @click="reload">Redémarrer le Jeu</button>
			</div>
			<p>Pour jouer au jeu, vous devez IMPERATIVEMENT choisir une lettre sur votre clavier. Bon jeu  et bonne chance !</p>
			<div id="letters" class="letters">
				<span v-for="letter in letters">{{ letter }}</span>
			</div>
			<div id="container" class="d-flex justify-content-center"></div>
			<div class="d-flex justify-content-center container-canvas" >
				<canvas id="myCanvas" width="250" height="250"></canvas>
			</div>
			<span id="timer" class="text-center timer">Il reste {{ timer }} s</span>
			<div class="alert text-center" :class="{ 'alert-success': isSuccess, 'alert-danger': isError }">{{ text }}</div>
		</div>
	</div>
</template>

<script>
	import Canvas from './Canvas.js'
	import $ from 'jquery'

	export default {
		name: 'Game',
		data () {
			return {
				timer: 60, // Max en secondes
				interval: null,
				categories: null, // Array des catégories
				text: null, // String pour afficher un message pour l'utilisateur
				Canvas: null, // Contient l'instance de l'objet Canvas
				letters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
				words: null, // Liste des mots de la catégorie
				word: null, // Mot actif sur la session de jeu
				length: null, // Longueur du mot sélectionné
				isSuccess: false, // Affiche ou non, la classe alert-success
				isError: false, // Affiche ou non, la classe alert-danger
				visible: false, // Affiche ou non différents éléments sur la page
				error: 0, // Compte le nombre d'erreur
				success: 0 // Compte le nombre de succés
			}
		},
		computed: {
			// Gestion d'une partie perdue 
			lose: function () {
				// Si l'utilisateur commet 11 erreurs
				if (this.error == 11) {
					// Affiche un message pour l'utilisateur
					this.text = "Désolé mais vous avez perdu !!! Tentez votre chance avec un autre mot"
					this.isError = true
					// On enléve l'événement 'keypress' sur la page
					$('body').off('keypress')
				}
			},
			// Gestion d'une partie gagnée
			win: function () {
				if (this.success == this.word.length) {
					// Affiche un message pour l'utilisateur
					this.text = "Bravo, vous avez gagné !!! Réessayez avec un autre mot"
					this.isSuccess = true
					// On met un terme au temps
					clearInterval(this.interval)
					// On passe en vert les bordures du container
					$('.container').css('border', '5px solid #096A09')
					// On enléve l'événement 'keypress' sur la page
					$('body').off('keypress')
					
				}
			},
			// Gestion du temps de jeu
			countDown: function () {
				// S'il reste au moins 10 secondes de jeu
				if (this.timer == 10) {
					// On modifie la couleur de la bordure en orange
					$('.container').css('border', '5px solid #ED7F10')
					
				}
				// Si on arrive au terme du temps 
				else if (this.timer == 0) {
					// On arrête l'éxécution du timer
					clearInterval(this.interval)
					// On modifie la couleur de la bordure en rouge
					$('.container').css('border', '5px solid #BF0000')
					// Affiche un message pour l'utilisateur
					this.text = "Désolé mais vous avez perdu !!! Tentez votre chance avec un autre mot"
					this.isError = true
					// On enléve l'événement 'keypress' sur la page
					$('body').off('keypress')
				}
			}
		},
		mounted () {
			// On affiche l'ensemble des catégories du jeu
			this.$http.get('http://localhost/pendu/static/words.json').then(response => {
				// On stocke la liste des mots de la catégorie
				this.categories = Object.keys(response.body)
			}, response => {
				console.log('Error Reload Page !!!!!')
			})
		},
		methods: {
			// Initialise le jeu 
			init () {
				// Valeur de la liste déroulante
				let value = $('#category').val()
				// Si la catégorie est valide
				if (value != 0) {
					// On va récupérer les mots de la catégorie sélectionnée
					this.$http.get('http://localhost/pendu/static/words.json').then(function (response) {
							// Liste des mots de la catégorie
							this.words = response.body[value] 
							// On rend visible les éléments du jeu
							this.visible = true 
							// On démarre le jeu
							this.start() 
							// On supprime le focus sur la liste déroulante
							$('#category').blur() 
						})
				}
			},
			// Effectue un décompte du temps
			time () {
				this.interval = setInterval(_ => {
					// On décrémente la propriété "timer"
					this.timer--
					// Vérifie la valeur de la propriété "timer"
					this.countDown
				}, 1000)
			},
			// Lors d'un choix d'une lettre par l'utilisateur 
			keyChoice () {
				// Tableau des lettres proposées
				let array = []
				//Lors de l'action d'une touche sur le clavier
				$('body').keypress(event => {
					// On récupére le code de la touche
					let keyCode = event.which
					// Si la touche n'est pas valide, on affiche un messge
					if (keyCode < 97 || keyCode > 122){
						// Message à l'attention de l'utlisateur
						alert("Veuillez taper sur une touche valide")
					}
					// Sinon, on va récupérer la lettre sélectionnée
					else {
						// On récupére le caractére du clavier
						let letter = String.fromCharCode(keyCode).toUpperCase()
						// On teste si la lettre n'est pas déjà utlisée
						if (array.indexOf(letter) != -1) {
							// Message à l'attention de l'utlisateur
							alert("Cette lettre a déjà été utlisée. Veuillez en choisir une autre")
						}
						// Si elle n'est pas utilisée, on peut poursuivre la suite du script
						else {
							// On pousse dans le tableau
							array.push(letter)
							// On effectue une boucle sur la totalité des lettres disponibles
							$('#letters').find('span').each((index, element) => {
								// S'il y a une correspondance
								if(letter == $(element).html()) {
									// On ajoute la classe "selected"
									$(element).addClass('selected')
									// On appel la méthode 'pick'
									this.pick(letter)
								}
							})
						}
					}
				})
			},
			// Rechargement de la page 
			reload () {
				window.location.reload()
			},
			// Initialisation du jeu au démarrage de la page
			start () {
				// On cible l'élément canvas 
				let canvas = document.getElementById('myCanvas')
				// On spécifie le contexte
				let context = canvas.getContext("2d")
				// On instancie l'objet Canvas
				this.Canvas = new Canvas(context)
				// On génére un indice compris entre zéro et la longueur du tableau
				let random = Math.floor(Math.random() * this.words.length)
				// Récupérer un élément du tableau au hasard
				this.word = this.words[random].toUpperCase()
				// String qui va contenir les éléments HTML de type input
				let inputs = ""
				// Dans le DOM, les différents champs qui vont correspondre au mot
				for (let i = 0; i < this.word.length; i++) {
					let pattern = /[\s-']/g
					let regex = new RegExp(pattern)
					// Si le caractére est un espace
					if (regex.test(this.word[i])) {
						// On insert un élément de type 'div'
						inputs += '<div style="width: 5%; margin-right: 15px; display: flex; align-items: center; justify-content: center; font-size: 45px; font-weight: bold;">' + this.word[i] + '</div>'
					}
					// Sinon, c'est que l'on va insérer un élément de type 'input'
					else {
						// On incrémente la chaine de caractéres
						inputs += '<input type="text" name="letter_' + i + '" readonly>'
					}
				}
				// On injecte dans le DOM l'élément
				$('#container').html(inputs)
				// Pattern des eléments à exclure du mot
				let pattern = /\s/g
				let regex = new RegExp(pattern)
				// Si le mot contient un des caractéres interdits
				if (regex.test(this.word)) {
					// On supprime ces caractéres interdits 
					this.word = this.word.replace(pattern, "")
				}
				// On permet à l'utilisateur de proposer des lettres
				this.keyChoice()
				// On démarre le compte à rebours
				this.time()
			},
			// Permet de choisir une lettre dans la liste 
			pick (letter) {
				// Si la lettre choisit figure dans le mot
				if (this.find(letter).length != 0) {
					// On va afficher la lettre à sa position dans le mot
					for (let i = 0; i < this.find(letter).length; i++) {
						// On place la lettre dans la bonne position dans le mot
						$('input').eq(this.find(letter)[i]).val(letter.toUpperCase())
						// On incrémente la propriété 'success'
						this.success++
					}
					// On affiche un message de victoire
					this.win
					
				}	
				// Si elle ne figure pas dans le mot
				else {
					// On utilise la méthode "draw"
					this.Canvas.draw(this.error)
					// On incrémente la propriété "error"
					this.error++
					// On affiche un message d'erreur
					this.lose
				}	
			},
			// Vérifie que la lettre figure dans le mot
			find (letter) {
				// Tableau qui va recevoir les occurences de la lettre dans le mot
				let matched = new Array()
				// On passe en revue le mot 
				for (let i = 0; i < this.word.length; i++) {
					// Si la lettre est présente dans le mot
					if (this.word[i] == letter) {
						// On place la position de la lettre dans le tableau
						matched.push(i)
					}
				}
				return matched
			}
		}
	}
</script>

<style>
	* {
		user-select: none;
	}
	body {
		background: url(http://api.thumbr.it/whitenoise-361x370.png?background=#ccccccff&noise=626262&density=35&opacity=35);
	}
	h1 {
		text-transform: uppercase;
	}
	p {
		text-align: center;
		margin: 10px 0;
		font-weight: bold;
	}
	button {
		margin: 0 auto;
	}
	input {
		width: 5%;
		border: none;
		border-bottom: 1px solid #000;
		margin-right: 15px;
		text-align: center;
		font-weight: bold;
		font-size: 45px;
	}
	canvas {
		margin-top: 30px;
		border: 2px solid #000;
		background-color: #ccc;
	}
	.container {
		margin: 50px auto;
		background-color: #FFFFFF;
		border: 5px solid #000;
	}
	.alert {
		margin-top: 20px;
	}
	.selected {
		color: #BF0000;
	}
	.letters {
		margin-top: 20px;
		padding: 20px;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.letters span {
		font-weight: bold;
		font-size: 30px;
	}
	.timer {
		display: block;
		font-weight: bold;
	}
</style>