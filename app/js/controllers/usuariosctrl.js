angular.module('auditoriaApp')

.controller('usuariosctrl' , function($scope, ConexionServ, $filter){


	


	ConexionServ.createTables();


	$scope.vercreandousuario = function(){
             

             $scope.verusuariocreado = !$scope.verusuariocreado

     
	

	}

	$scope.veractuausers = function(usuario){



		$scope.modusers = !$scope.modusers;

		$scope.user_editars = usuario;


		 
	}


	 $scope.Insertenderusuario = function(usuario_crear){
	  	
	 	consulta ="INSERT INTO usuarios(nombres, apellidos, sexo ,username, password) VALUES(?, ?, ?, ?, ?) "
	   ConexionServ.query(consulta, [usuario_crear.nombres, usuario_crear.apellidos, usuario_crear.sexo, usuario_crear.username, usuario_crear.password]).then(function(result){

           console.log('entidad creada', result)
           alert('Usuario creado exitosamente, presiona F5 Para recargar')

	   } , function(tx){

	   	console.log('Usuario no se pudo crear' , tx)

	   });

	 } 

	  $scope.vertablaenusuariosmostrar = function(){
	   
	   ConexionServ.query('SELECT rowid , nombres, apellidos, sexo, username, password from usuarios', []).then(function(result){

	          $scope.usuarios = result;

		   } , function(tx){

		   	console.log('Error no es posbile traer usuarios' , tx)

		   })
	 } 

	 $scope.vertablaenusuariosmostrar();

	 $scope.actusers = function(user_cambiar){
	  	
	 consulta ="UPDATE  usuarios SET nombres=?, apellidos=?, sexo=?, username=?, password=? WHERE rowid=? "
	   ConexionServ.query(consulta,[user_cambiar.nombres, user_cambiar.apellidos, user_cambiar.sexo, user_cambiar.username, user_cambiar.password, user_cambiar.rowid, ]).then(function(result){

           console.log('usuario Actualizado', result)
           alert('Usuario actualizado correctamente presione F5 para recargar')

	   } , function(tx){

	   	console.log('usuario no se pudo actualizar' , tx)

	   });

	 } 

	  $scope.elimninaruser = function(user){
	  	
	 	consulta ="DELETE FROM usuarios WHERE rowid=? ";

	   ConexionServ.query(consulta,[user.rowid]).then(function(result){


           console.log('usuario eliminido', result);
           $scope.usuarios = $filter('filter') ($scope.usuarios, {rowid: '!' + user.rowid})
	   } , function(tx){

	   	console.log('usuario no se pudo Eliminar' , tx)

	   });

	 } 

	
});