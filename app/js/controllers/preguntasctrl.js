angular.module('auditoriaApp')

.controller('preguntasctrl' , function($scope, ConexionServ, $filter){

  



ConexionServ.createTables();

$scope.veractpregunta = function(pregunta){

	$scope.actuasdpregunta = !$scope.actuasdpregunta;


	 
		
		$scope.pregunta_editar = pregunta;
	}


 

 


	 $scope.Insertpreguntas = function(pregunta_crear){


	  	
	 	consulta ="INSERT INTO preguntas(definition, tipo, option1 ,option2, option3, option4, auditoria_id, modificado) VALUES(?, ?, ?, ?, ?, ?, ?, ?) "
	   ConexionServ.query(consulta, [pregunta_crear.definition, pregunta_crear.tipo, pregunta_crear.option1, pregunta_crear.option2, pregunta_crear.option3, pregunta_crear.option4, pregunta_crear.auditoria,  '1']).then(function(result){

           console.log('pregunta creada', result)
           alert('pregunta creado exitosamente, presiona F5 Para recargar')

	   } , function(tx){

	   	console.log('pregunta no se pudo crear' , tx)

	   });

	 } 


	 $scope.vercrearpregunta = function() {


	 	$scope.vercreando = !$scope.vercreando;

	 }


	   $scope.vertablapreguntarosmostrar = function(){

	    
	   ConexionServ.query("SELECT p.* from preguntas p INNER JOIN auditorias a ON p.auditoria_id = a.rowid  e.rowid"
         
	   	, []).then(function(result){

	          $scope.preguntas = result;
	          console.log(result);

		   } , function(tx){

		   	console.log('Error no es posbile traer preguntas' , tx)

		   })

 
	   	$scope.traerDatos = function() {
	   		consulta = "SELECT rowid, * from preguntas ";
INNER JOIN entidades e ON a.entidad = 
			ConexionServ.query(consulta, []).then(function(result) {
				$scope.preguntas = result;
			},function(tx) {
				console.log("Error no es posbile traer preguntas", tx);
			});
	   	};


	   ConexionServ.query('SELECT *, rowid from auditorias', []).then(function(result){

	          $scope.auditorias = result;

		   } , function(tx){

		   	console.log('Error no es posbile traer auditorias' , tx)

		   })

	    ConexionServ.query('SELECT *, rowid from entidades', []).then(function(result){

	          $scope.entidades = result;

		   } , function(tx){

		   	console.log('Error no es posbile traer entidades' , tx)

		   });
	 
	 
	 } 

	 $scope.vertablapreguntarosmostrar();


	 $scope.preguntactua = function(pregunta_cambiar){
	  	
	 consulta ="UPDATE  preguntas SET definition=?, tipo=?, option1=? ,option2=?, option3=?, option4=?, auditoria=? WHERE rowid=? "
	   ConexionServ.query(consulta,[pregunta_cambiar.definition, pregunta_cambiar.tipo, pregunta_cambiar.option1, pregunta_cambiar.option2, pregunta_cambiar.option3, pregunta_cambiar.option4, pregunta_cambiar.auditoria, pregunta_cambiar.rowid]).then(function(result){

           console.log('Pregunta Actualizado', result)
           alert('Pregunta actualizado correctamente presione F5 para recargar')

           for (var i = 0; i < $scope.auditorias.length; i++) {
			   		fecha = new Date($scope.auditorias[i].fecha);
			   		console.log(fecha);
				  	$scope.auditorias[i].fecha = fecha.getFullYear() +  ' / '  + fecha.getMonth() +  ' / '  + fecha.getDate();

				   
				  	
				  }

		   

	   } , function(tx){

	   	console.log('Pregunta no se pudo actualizar' , tx)

	   });

	 } 


	  $scope.elimninpreguntas = function(pregunta){
	  	
	 	var res = confirm("¿Seguro que desea eliminar ? ");

		if (res == true) {
			consulta = "UPDATE  preguntas SET eliminado=? WHERE rowid=? ";
		ConexionServ.query(consulta, ['1', union.rowid]).then( function(result) {
			console.log("pregunta Eliminada", result);
			toastr.success("pregunta Eliminada Exitosamente.");
		},function(tx) {
			toastr.info("La pregunta que intenta eliminar no se pudo actualizar.");
		});
	}

	 } 

});