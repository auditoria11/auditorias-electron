angular.module("auditoriaApp")

.controller("EntidadesCtrl", function($scope, ConexionServ, $filter, toastr, $location, $anchorScroll, $timeout) {
    $scope.entidades 		= true;
    $scope.distrito_new 	= {};
	$scope.modentidades 	= false;
	$scope.verCrearDistrito = false;
	$scope.usuarios 		= [];

	
	btGrid1 = '<a uib-tooltip="Editar" tooltip-placement="left" tooltip-append-to-body="true" class="btn btn-default btn-xs icon-only info" ng-click="grid.appScope.Ver_actualizar_iglesia(row.entity)"><i class="glyphicon glyphicon-pencil "></i></a>'
	btGrid2 = '<a uib-tooltip=" Eliminar" tooltip-placement="right" tooltip-append-to-body="true" class="btn btn-default btn-xs icon-only danger" ng-click="grid.appScope.EliminarIglesia(row.entity)"><i class="glyphicon glyphicon-remove  "></i></a>'
	bt2 	= '<span style="padding-left: 2px; padding-top: 4px;" class="btn-group">' + btGrid1 + btGrid2 + '</span>'
		
	$scope.gridOptions = {
		showGridFooter: true,
		enableSorting: true,
		enableFiltering: true,
		enebleGridColumnMenu: false,
		enableCellEdit: true,
		enableCellEditOnFocus: true,
		columnDefs: [
			{ name: 'no', displayName:'No', width: 45, enableCellEdit: false, enableColumnMenu: false, cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
			{ name: 'edicion', displayName:'Edición', width: 60, enableSorting: false, enableFiltering: false, cellTemplate: bt2, enableCellEdit: false, enableColumnMenu: true},
			{ field: 'nombre' },
			{ field: 'alias' },
			{ field: 'codigo' },
			{ field: 'Distrito' },
			{ field: 'zona' },
			{ field: 'celular' },
			{ field: 'tesorero_nombres' }


		],
		onRegisterApi: function( gridApi ) {
			$scope.grid1Api = gridApi;
			gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue){

				if (newValue != oldValue){
					toastr.info('Aun no se guarda');
				}
			})
			$timeout(function(){ 
			  $scope.$apply()
			},0)
		}
	};
		
	
	$scope.crear_distrito = function() {


		$scope.verCrearDistrito = true;

		$timeout(function(){ 
		     $location.hash('nueva_new_new_distrito');
     		$anchorScroll()
		}, 100)




	};
    $scope.cancelar_crear_distrito = function() {
		$scope.distrito_new 	= {};
		$scope.verCrearDistrito = false;
	};
	
	$scope.insertar_distrito = function (distrito) {
		console.log(distrito);
		$scope.pastor_new_id 	= null;
		$scope.tesorero_new_id 	= null;
		
		if (distrito.pastor) {
			if (distrito.pastor.rowid) {
				$scope.pastor_new_id = distrito.pastor.rowid;
			}
		}
		
		if (distrito.tesorero) {
			if (distrito.tesorero.rowid) {
				$scope.tesorero_new_id = distrito.tesorero.rowid;
			}
		}
		
		consulta = 'INSERT INTO distritos(nombre, alias, codigo, zona, pastor_id, tesorero_id) VALUES(?,?,?,?,?,?)';
		
		ConexionServ.query(consulta, [distrito.nombre, distrito.alias, distrito.codigo, distrito.zona, $scope.pastor_new_id, $scope.tesorero_new_id]).then(function(result) {
			$scope.traerDatos();
			  toastr.success('Se ha creado un nuevo Distrito Exitosamente.');
		}, function(tx) {
			console.log("Error no es posbile traer Distritos", tx);
		});
		
	}
	  
	  

    $scope.crearI = function() {
      $scope.vercrear = !$scope.vercrear;
    };


    $scope.modentidad = function(entidad) {
      $scope.modentidades = !$scope.modentidades;

      $scope.entidad_editar = entidad;
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
		
		// Traemos IGLESIAS
		$scope.consulta_igle = "SELECT i.rowid, i.nombre, i.alias, i.distrito_id, i.zona,  i.tesorero_id, i.secretario_id, "+
					"t.nombres as tesorero_nombres, t.apellidos as tesorero_apellidos " +
				"from iglesias i "+
				"LEFT JOIN usuarios t ON t.tipo='Tesorero' and t.rowid=i.tesorero_id "+
				"LEFT JOIN usuarios s ON s.tipo='Secretario' and s.rowid=i.secretario_id ";

		ConexionServ.query($scope.consulta_igle, []).then(function(result) {
			$scope.iglesias = result;
			$scope.gridOptions.data = result;
		}, function(tx) {
			console.log("Error no es posbile traer usuarios", tx);
		});
		
		// Traemos DISTRITOS
		consulta = "SELECT d.rowid, d.*, "+
					"p.nombres as pastor_nombres, p.apellidos as pastor_apellidos "+
				"from distritos d " + 
	  			"INNER JOIN usuarios p ON p.tipo='Pastor' and p.rowid=d.pastor_id";

    	ConexionServ.query(consulta, []).then(function(result) {
          $scope.distritos = result;
        }, function(tx) {
          console.log("Error no es posbile traer Iglesias", tx);
        });



        // Traemos Uniones
		consulta = "SELECT rowid, nombre, alias, codigo, division_id from uniones";

    	ConexionServ.query(consulta, []).then(function(result) {
          $scope.uniones = result;
        }, function(tx) {
          console.log("Error no es posbile traer Uniones", tx);
        });

         // Traemos Asociaciones
		consulta = "SELECT aso.rowid, aso.* , un.nombre as nombre_union  from asociaciones aso INNER JOIN uniones un ON aso.union_id = un.rowid ";

    	ConexionServ.query(consulta, []).then(function(result) {
          $scope.asociaciones = result;
        }, function(tx) {
          console.log("Error no es posbile traer asociaciones", tx);
        });
    };

	$scope.traerDatos();
	
	
	

    $scope.Insertentidad = function(entidad_crear) {
    	consulta = "INSERT INTO entidades(nombres, alias, pastor, celular) VALUES(?, ?, ?, ?) ";
		ConexionServ.query(consulta, [ entidad_crear.nombres, entidad_crear.alias, entidad_crear.pastor, entidad_crear.celular ]).then(function(result) {
          console.log("entidad creada", result);
		  alert("Entidad creada exitosamente");
		  
        }, function(tx) {
          console.log("entidad no se pudo crear", tx);
        }
      );
    };

    $scope.actuentidad = function(entidad_cambiar) {
      consulta =
        "UPDATE  entidades SET nombres=?, alias=?, pastor=?, celular=? WHERE rowid=? ";
      ConexionServ.query(consulta, [
        entidad_cambiar.nombres,
        entidad_cambiar.alias,
        entidad_cambiar.pastor,
        entidad_cambiar.celular,
        entidad_cambiar.rowid
      ]).then(
        function(result) {
          console.log("entidad Actualizada", result);
        },
        function(tx) {
          console.log("entidad no se pudo actualizar", tx);
        }
      );
    };

    $scope.eliminarentidad = function(entidad) {
      consulta = "DELETE FROM entidades WHERE rowid=? ";

      ConexionServ.query(consulta, [entidad.rowid]).then(
        function(result) {
          console.log("entidad eliminida", result);
          $scope.entidades = $filter("filter")($scope.entidades, {
            rowid: "!" + entidad.rowid
          });
        },
        function(tx) {
          console.log("Entidad no se pudo Eliminar", tx);
        }
      );
    };



    


	 	$scope.EliminarDistrito = function(distrito){
	  	
	  	var res = confirm("¿Seguro que desea eliminar ? ");

		if (res == true) {

		 	consulta ="DELETE FROM distritos WHERE rowid=? ";

			ConexionServ.query(consulta,[distrito.rowid]).then(function(result){

				console.log('Distrito  eliminido', result);
				$scope.distritos = $filter('filter') ($scope.distritos, {rowid: '!' + distrito.rowid})
                toastr.success('Distrito eliminado.');
                $scope.focusOnValorNew  = true;
            
                
			} , function(tx){
				console.log('Distrito no se pudo Eliminar' , tx)
			});
		}

     }



     $scope.VerActualizarDistrito = function(distrito){

     	$scope.VerActualizandoDistrito 	= true;

     	$scope.distrito_new_distric 	= distrito;

     	for (var i = 0; i < $scope.usuarios.length; i++) {
     		if (distrito.pastor_id == $scope.usuarios[i].rowid){
     			$scope.distrito_new_distric.pastor = $scope.usuarios[i];
     		}
     		if (distrito.tesorero_id == $scope.usuarios[i].rowid){
     			$scope.distrito_new_distric.tesorero = $scope.usuarios[i];
     		}
     	}

 
		


		$timeout(function(){ 
     	$location.hash('editar-distrito');
     	$anchorScroll()
     	}, 100)

     };




	 $scope.ActualizarDistrito = function(actuali_distrito){
	  
	  console.log(actuali_distrito);
	 consulta ="UPDATE  distritos SET nombre=?, alias=?, codigo=?, zona=? , pastor_id=?, tesorero_id=? WHERE rowid=? "
	   ConexionServ.query(consulta,[actuali_distrito.nombre, actuali_distrito.alias, actuali_distrito.codigo, actuali_distrito.zona, actuali_distrito.pastor_id, actuali_distrito.tesorero_id, actuali_distrito.rowid ]).then(function(result){

           console.log('Distrito Actualizado', result)

           toastr.success('Distrito Actualizado Exitosamente.')

         		   
   
	   } , function(tx){

	   	console.log('Distrito no se pudo actualizar' , tx)
	   	 toastr.info('Distrito no se pudo actualizar.')

	   });

	 } 
 
	$scope.Cancelar_Actualizar_Distrito = function() {
		$scope.VerActualizandoDistrito = false;
	};



	$scope.ActualizarIglesia = function(iglesia_actua_new){

		if (!iglesia_actua_new.tesorero) {
			iglesia_actua_new.tesorero = {rowid: null};
		}
		if (!iglesia_actua_new.secretario) {
			iglesia_actua_new.secretario = {rowid: null};
		}

	 consulta ="UPDATE  iglesias SET nombre=?, alias=?,  distrito_id=?, zona=?, tesorero_id=?, secretario_id=? WHERE rowid=? "
	   ConexionServ.query(consulta,[iglesia_actua_new.nombre, iglesia_actua_new.alias,  iglesia_actua_new.distrito.rowid,  iglesia_actua_new.zona,  iglesia_actua_new.tesorero.rowid, iglesia_actua_new.secretario.rowid, iglesia_actua_new.rowid ]).then(function(result){

           console.log('Iglesia Actualizado', result)
           toastr.success('Iglesia Actualizado Exitosamente.')

         		   
   iglesia_actua_new.distrito
	   } , function(tx){

	   	console.log('Iglesia no se pudo actualizar' , tx)
	   	 toastr.info('Iglesia no se pudo actualizar.')

	   });

	 } 



	 	$scope.Cancelar_Actualizar_Iglesia = function() {
		$scope.ver_Actualizando_iglesia = false;
	  };


	$scope.Ver_actualizar_iglesia = function(iglesia) {

		$scope.ver_Actualizando_iglesia = true;


		$scope.iglesia_actua_new 	= iglesia;

     	for (var i = 0; i < $scope.distritos.length; i++) {
     		if (iglesia.distrito_id == $scope.distritos[i].rowid){
     			$scope.iglesia_actua_new.distrito = $scope.distritos[i];
     		}
     	}


     	for (var i = 0; i < $scope.usuarios.length; i++) {
     		if (iglesia.tesorero_id == $scope.usuarios[i].rowid){
     			$scope.iglesia_actua_new.tesorero = $scope.usuarios[i];
     		}
     		if (iglesia.secretario_id == $scope.usuarios[i].rowid){
     			$scope.iglesia_actua_new.secretario = $scope.usuarios[i];
     		}
     	}


   	

      
	$timeout(function(){ 
     	$location.hash('editar-iglesia');
     	$anchorScroll()
     }, 100)

	};


	$scope.EliminarIglesia = function(iglesia){
	  	
	  	var res = confirm("¿Seguro que desea eliminar ? ");

		if (res == true) {

		 	consulta ="DELETE FROM iglesias WHERE rowid=? ";

			ConexionServ.query(consulta,[iglesia.rowid]).then(function(result){

				//$scope.iglesias = $filter('filter') ($scope.iglesias, {rowid: '!' + iglesia.rowid}, true)
                toastr.success('Iglesia eliminado.');
                
                ConexionServ.query($scope.consulta_igle, []).then(function(result) {
					$scope.iglesias = result;
					$scope.gridOptions.data = result;
				}, function(tx) {
					console.log("Error no es posbile traer usuarios", tx);
				});
                
			} , function(tx){
				console.log('La iglesia no se pudo Eliminar' , tx)
			});
		}

     }



      $scope.CrearIglesia_insertar = function(iglesia) {

      	console.log(iglesia);
		consulta = 'INSERT INTO iglesias(nombre, alias, distrito_id, zona,  tesorero_id, secretario_id) VALUES(?,?,?,?,?,?)';
		
		ConexionServ.query(consulta, [iglesia.nombre, iglesia.alias,  iglesia.distrito.rowid, iglesia.zona,  iglesia.tesorero_id, iglesia.secretario.rowid ]).then(function(result) {
			$scope.traerDatos();
			  toastr.success('Se ha creado un nuevo Distrito Exitosamente.');
		}, function(tx) {
			console.log("Error no es posbile traer Distritos", tx);
		});
		
	}



  $scope.VerCreandoIglesia = function() {

  	$scope.Vercreando_iglesia = true;

  	$timeout(function(){ 
     	$location.hash('nueva_new_new_iglesia');
     	$anchorScroll()
     	}, 100)


  };


  $scope.cancerl_crear_iglesia = function() {

  	$scope.Vercreando_iglesia = false;


  };





      $scope.inserter_union = function(creatar_union) {
		consulta = 'INSERT INTO uniones(nombre, alias, codigo) VALUES(?,?,?)';
		
		ConexionServ.query(consulta, [creatar_union.nombre, creatar_union.alias, creatar_union.codigo]).then(function(result) {
			$scope.traerDatos();
			  toastr.success('Se ha creado una Nueva Union Exitosamente.');
		}, function(tx) {
			console.log("Error no es posbile traer Uniones", tx);

        



		});

		
	 }




	$scope.CancelarCrearUnion = function(){
      $scope.verCreandoUniones = false;
	};


	$scope.verCrearUnion = function(){
      $scope.verCreandoUniones = true;


	 	$timeout(function(){ 
		     $location.hash('nueva_new_new_union');
     		$anchorScroll()
		}, 100)
	};


	 $scope.ActualizarUniones = function(actuali_union){
	  
	 consulta ="UPDATE  uniones SET nombre=?, alias=?, codigo=?  WHERE rowid=? "
	   ConexionServ.query(consulta,[actuali_union.nombre, actuali_union.alias, actuali_union.codigo,  actuali_union.rowid ]).then(function(result){

           console.log('Union Actualizada', result)

           toastr.success('Union Actualizada Exitosamente.')

         		   
   
	   } , function(tx){
	 
	   	 toastr.info('La Union que intenta actualizar no se pudo actualizar.')

	   });

	 } 


	 $scope.VerActualizarUniones = function(union){
        $scope.VeractualizandoUniones = true;

        $scope.union_creatar_new 	= union;




       $timeout(function(){ 
     	$location.hash('editar-uniones');
     	$anchorScroll()
       }, 100)





	 };


	 $scope.CancelarActualizarUniones = function(){
        $scope.VeractualizandoUniones = false;
	 };
  


   $scope.EliminarUnion = function(union){
	  	
	  	var res = confirm("¿Seguro que desea eliminar ? ");

		if (res == true) {

		 	consulta ="DELETE FROM uniones WHERE rowid=? ";

			ConexionServ.query(consulta,[union.rowid]).then(function(result){

				console.log('union  eliminida', result);
				$scope.uniones = $filter('filter') ($scope.uniones, {rowid: '!' + union.rowid})
                toastr.success('Union eliminada.');
                $scope.focusOnValorNew  = true;
            
                
			} , function(tx){
				console.log('No se pudo Eliminar La union que quiere eliminar ' , tx)
			});
		}

     }

    

      $scope.Insertar_asociaciones = function(creater_asociaciones) {
      	console.log(creater_asociaciones);
		consulta = 'INSERT INTO asociaciones(nombre, alias, codigo, union_id) VALUES(?,?,?,?)';
		
		ConexionServ.query(consulta, [creater_asociaciones.nombre, creater_asociaciones.alias, creater_asociaciones.codigo, creater_asociaciones.union.rowid]).then(function(result) {
			$scope.traerDatos();
			  toastr.success('Se ha creado una Nueva asocación  Exitosamente.');
		}, function(tx) {
			console.log("Error no es posbile traer asocaciones", tx);

        



		});

		
	 }



	 $scope.VerCrearAsociaciones = function(){

	 	$scope.MostrandoAsociaciones = true;

	 	$timeout(function(){ 
		     $location.hash('nueva_asociacion');
     		$anchorScroll()
		}, 100)


	 };


	 $scope.CancelarVerCreandoAsoaciones = function(){

	 	$scope.MostrandoAsociaciones = false;

	 };


	  $scope.EliminarAsociacion = function(asociation){
	  	
	  	var res = confirm("¿Seguro que desea eliminar ? ");

		if (res == true) {

		 	consulta ="DELETE FROM asociaciones WHERE rowid=? ";

			ConexionServ.query(consulta,[asociation.rowid]).then(function(result){

				console.log('union  eliminida', result);
				$scope.asociaciones = $filter('filter') ($scope.asociaciones, {rowid: '!' + asociation.rowid})
                toastr.success('Asociación eliminada.');
                $scope.focusOnValorNew  = true;
            
                
			} , function(tx){
				console.log('No se pudo Eliminar La Asociación que quiere eliminar ' , tx)
			});
		}

     }


     $scope.VerActualizarAsociaciones = function(asociation){

	 	$scope.VerActualizandoAsociaciones = true;
	 	$scope.actuali_new_asociation = asociation;



	 	for (var i = 0; i < $scope.uniones.length; i++) {
     		if (asociation.union_id == $scope.uniones[i].rowid){
     			$scope.actuali_new_asociation.union = $scope.uniones[i];
     		}
     	}


     	$timeout(function(){ 
		     $location.hash('editar_new_new_asociation');
     		$anchorScroll()
		}, 100)






	 };

	  


	  $scope.ActualizarAsociaciones = function(actuali_asociation){
	  
	 consulta ="UPDATE  uniones SET nombre=?, alias=?, codigo=?, union_id=?  WHERE rowid=? "
	   ConexionServ.query(consulta,[actuali_asociation.nombre, actuali_asociation.alias, actuali_asociation.codigo, actuali_asociation.union.rowid,  actuali_asociation.rowid ]).then(function(result){

           console.log('Asocacion Actualizada', result)

           toastr.success('Asociación Actualizada Exitosamente.')

         		   
   
	   } , function(tx){
	 
	   	 toastr.info('La Asociación que intenta actualizar no se pudo actualizar.')

	   });

	 } 





	  $scope.CancelarVerActualizarAsociaciones = function(){

	 	$scope.VerActualizandoAsociaciones = false;

	 };








	
	
	
	
  });



