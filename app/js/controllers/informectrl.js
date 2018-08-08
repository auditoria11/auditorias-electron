angular.module('auditoriaApp')
.controller('informectrl', function($scope, ConexionServ, $state, toastr, $location, $anchorScroll, $timeout){

  
	$scope.imprimir = function() {
		
		const {ipcRenderer} = require('electron');
		console.log(ipcRenderer);
		window.print();
    };


	// Traemos todos los datos que necesito para trabajar
    $scope.traerDatos = function() {

		// Traemos USUARIOS
		consulta = "SELECT rowid, nombres, apellidos, sexo, tipo, celular, username from usuarios";

		ConexionServ.query(consulta, []).then(function(result) {
			$scope.usuarios = result;

		}, function(tx) {
			console.log("Error no es posbile traer usuarios", tx);
		});
		
		
    };

	$scope.traerDatos();



	$scope.VerUniones = function(){
		$state.go('panel.informe.uniones');
	}


	$scope.VerAsociaciones = function(){
		$state.go('panel.informe.asociaciones');
	}

	$scope.VerDistritos = function(){
		$state.go('panel.informe.distritos');
	}

	$scope.VerIglesias = function(){
		$state.go('panel.informe.iglesias');
	}
	
	




});