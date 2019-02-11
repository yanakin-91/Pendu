<?php 
// On se connecte à la base de données
try {
	$db = new PDO('mysql:host=localhost;dbname=game', 'root', '');
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$db->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND, "SET NAMES utf8");
}
catch(PDOException $e) {
	echo "Impossible de se connecter";
}
// Dans le cas ou l'on souhaite initialiser le jeu au démarrage
if ($_GET["mod"] == "init") {
	// On affiche l'ensemble des catégories
	$query = $db->prepare('SELECT * FROM category ORDER BY category ASC');
	$query->execute();
	$data = $query->fetchAll(\PDO::FETCH_ASSOC);
}
// Sinon, c'est que l'on veut récupérer l'ensemble des mots de la catégorie
else {
	$query = $db->prepare('SELECT word FROM words WHERE id_category = :id');
	$query->execute(array("id" => $_GET["id"]));
	$data = $query->fetchAll(\PDO::FETCH_COLUMN);

}
echo json_encode($data);