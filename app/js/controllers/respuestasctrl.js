angular.module('auditoriaApp')

.controller('respuestasctrl' , function($scope, ConexionServ, $filter){


	$scope.vercreandorespuestas = function() {

		$scope.vercradasdrepsuestas = !$scope.vercradasdrepsuestas;
    

  

   

	}


	$scope.insertandorespuesats = function(respuestas_crear){

	  	

	 	consulta ="INSERT INTO respuestas(pregunta_id, auditoria_id, respuestas, modificado ) VALUES(?, ?, ?, ?) "
	   ConexionServ.query(consulta, [respuestas_crear.pregunta_id, respuestas_crear.auditoria_id, respuestas_crear.respuestas, '1']).then(function(result){

           console.log('respuesta creada', result)
           alert('respuesta creado exitosamente, presiona F5 Para recargar')

	   } , function(tx){

	   	console.log('respuesta no se pudo crear' , tx)

	   });

	 } 

	  $scope.vermostrandotablarespuestas = function(){

	   consulta = "SELECT  re.*, re.rowid, p.definition, p.tipo ,  a.fecha, a.hora" + 
	   				"from respuestas re " + 
	   				"INNER JOIN preguntas p ON re.pregunta_id = p.rowid " + 
	   				"INNER JOIN auditorias a ON re.auditoria_id = a.rowid  ";
	   
	   ConexionServ.query(consulta, []).then(function(result){
	   		console.log(result);
	          $scope.respuestas = result;
	          console.log( $scope.respuestas)

		   } , function(tx){

		   	console.log('Error no es posbile traer Respuestas' , tx)

		   })

	    ConexionServ.query('SELECT *, rowid  from preguntas', []).then(function(result){

	          $scope.preguntas = result;

		   } , function(tx){

		   	console.log('Error no es posbile traer preguntas' , tx)

		   })


	     ConexionServ.query('SELECT  a.*, a.rowid, e.nombres, e.alias  from auditorias a INNER JOIN entidades e ON a.entidad = e.rowid  ', []).then(function(result){
 				console.log(result);
	          $scope.auditorias = result;

	          

			   for (var i = 0; i < $scope.auditorias.length; i++) {
			   		fecha = new Date($scope.auditorias[i].fecha);
			   		console.log(fecha);
				  	$scope.auditorias[i].fecha = fecha.getFullYear() +  ' / '  + fecha.getMonth() +  ' / '  + fecha.getDate();

				   
				  	
				  }

		   } , function(tx){

		   	console.log('Error no es posbile traer auditorias' , tx)

		   })

	      ConexionServ.query('SELECT *, rowid  from entidades', []).then(function(result){

	          $scope.entidades = result;

		   } , function(tx){

		   	console.log('Error no es posbile traer entidades' , tx)

		   });

	 } 

	 $scope.vermostrandotablarespuestas();


	$scope.veractuausers = function(respuesta){

		$scope.mostrarrespuesta = !$scope.mostrarrespuesta;

		
		
		$scope.respuesta_actua = respuesta;
	}



  $scope.acrepuasd = function(respuesta_cambiar){
	  	
	 consulta ="UPDATE  respuestas SET pregunta_id=?, auditoria_id=?, respuestas=?, modificado=? WHERE rowid=? "
	   ConexionServ.query(consulta,[respuesta_cambiar.pregunta_id, respuesta_cambiar.auditoria_id, respuesta_cambiar.respuestas, respuesta_cambiar.rowid, '1' ]).then(function(result){

           console.log('respuesta Actualizado', result)
           alert('respuesta actualizado correctamente presione F5 para recargar')

	   } , function(tx){

	   	console.log('respuesta no se pudo actualizar' , tx)

	   });

	 } 

	 $scope.elimninarespuestas = function(respuesta){
	  	
	 		var res = confirm("¿Seguro que desea eliminar ? ");

		if (res == true) {
			consulta = "UPDATE  respuestas SET eliminado=? WHERE rowid=? ";
		ConexionServ.query(consulta, ['1', union.rowid]).then( function(result) {
			console.log("respuestas Eliminada", result);
			toastr.success("respuestas Eliminada Exitosamente.");
		},function(tx) {
			toastr.info("La respuestas que intenta eliminar no se pudo actualizar.");
		});
	}
	 } 


	


});


