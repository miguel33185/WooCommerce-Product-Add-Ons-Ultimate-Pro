(function($) {

	$( document ).ready( function() {

		var pewc_conditions = {

			init: function() {

				this.initial_check();
				$( '.pewc-condition-trigger input' ).on( 'change input keyup paste', this.trigger_condition_check );
				$( '.pewc-condition-trigger select' ).on( 'change', this.trigger_condition_check );
				$( '.pewc-calculation-trigger input' ).on( 'change input keyup paste', this.trigger_calculation );

			},

			quantity_update: function() {

			},

			initial_check: function() {
				$( '.pewc-condition-trigger' ).each( function() {
					var field = $( this );
					var groups = JSON.parse( $( field ).attr( 'data-trigger-groups' ) );
					for( var g in groups ) {
						conditions_obtain = pewc_conditions.check_group_conditions( groups[g] );
						var action = $( '#pewc-group-' + groups[g] ).attr( 'data-condition-action' );
						pewc_conditions.assign_classes( conditions_obtain, action, groups[g] );
					}
				});
			},

			trigger_calculation: function() {
				// Possibly add a delay here to ensure calculations are made
				var calculations = $( this ).closest( '.pewc-item' ).attr( 'data-trigger-calculations');
				if( calculations ) {
					calculations = JSON.parse( calculations );
					for( var c in calculations ) {
						$( '.pewc-field-' + calculations[c] ).find( '.pewc-calculation-value' ).trigger( 'change' );
					}
				}
			},

			trigger_condition_check: function() {
				console.log( 'trig' );
				var field = $( this ).closest( '.pewc-item' );
				var groups = JSON.parse( $( field ).attr( 'data-trigger-groups' ) );
				for( var g in groups ) {
					console.log( groups[g] );
					conditions_obtain = pewc_conditions.check_group_conditions( groups[g] );
					var action = $( '#pewc-group-' + groups[g] ).attr( 'data-condition-action' );
					pewc_conditions.assign_classes( conditions_obtain, action, groups[g] );
				}
			},

			check_group_conditions: function( group_id ) {
				var conditions = JSON.parse( $( '#pewc-group-' + group_id ).attr( 'data-conditions' ) );
				var match = $( '#pewc-group-' + group_id ).attr( 'data-condition-match' );
				var is_visible = false;
				if( match == 'all' ) {
					is_visible = true;
				}
				console.log( conditions );
				for( var i in conditions ) {
					var condition = conditions[i];
					var value = pewc_conditions.get_field_value( condition.field, condition.field_type );
					console.log( value );
					var meets_condition = this.field_meets_condition( value, condition.rule, condition.value );
					if( meets_condition && match =='any' ) {
						return true;
					} else if( ! meets_condition && match =='all' ) {
						return false;
					}
				}
				return is_visible;
			},

			// Get the value of the specified field
			get_field_value: function( field_id, field_type ) {
				var field_wrapper = $( '.' + field_id.replace( 'field', 'group' ) );
				var input_fields = ['text','number','calculation'];
				if( input_fields.includes( field_type ) ) {
					return $( '#' + field_id ).val();
				} else if( field_type == 'select' ) {
					return $( '#' + field_id ).val();
				} else if( field_type == 'checkbox_group' ) {
					var field_value = [];
					$( field_wrapper ).find( 'input:checked' ).each( function() {
						field_value.push( $( this ).val() );
					});
					return field_value;
				} else if( field_type == 'products' ) {
					var field_value = [];
					$( field_wrapper ).find( 'input:checked' ).each( function() {
						field_value.push( $( this ).val() );
					});
					return field_value;
				} else if( field_type == 'image_swatch' ) {
					if( $( field_wrapper ).hasClass( 'pewc-item-image-swatch-checkbox' ) ) {
						// Array
						var field_value = [];
						$( field_wrapper ).find( 'input:checked' ).each( function() {
							field_value.push( $( this ).val() );
						});
						return field_value;
					} else {
						return $( '#' + field_id ).val();
					}
				} else if( field_type == 'checkbox' ) {
					if( $( '#' + field_id ).prop( 'checked' ) ) {
						return '__checked__';
					}
					return false;
				} else if( field_type == 'radio' ) {
					return $( '.' + field_id + ' input:radio:checked' ).val();
				}
			},

			field_meets_condition: function( value, rule, required_value ) {
				if( rule == 'is' || rule == 'cost-equals' ) {
					return value == required_value;
				} else if( rule == 'is-not' ) {
					return value != required_value;
				} else if( rule == 'contains' ) {
					return value.includes( required_value );
				} else if( rule == 'does-not-contain' ) {
					return ! value.includes( required_value );
				} else if( rule == 'greater-than' ) {
					return value > required_value;
				} else if( rule == 'greater-than-equals' ) {
					return value >= required_value;
				} else if( rule == 'less-than' ) {
					return value < required_value;
				} else if( rule == 'less-than-equals' ) {
					return value <= required_value;
				}
			},

			assign_classes: function( conditions_obtain, action, group_id ) {
				if( conditions_obtain ) {
					if( action == 'show' ) {
						$( '#pewc-group-' + group_id ).removeClass( 'pewc-group-hidden' );
						$( '#pewc-tab-' + group_id ).removeClass( 'pewc-group-hidden' );
					} else {
						$( '#pewc-group-' + group_id ).addClass( 'pewc-group-hidden' );
						$( '#pewc-tab-' + group_id ).addClass( 'pewc-group-hidden' );
					}
				} else {
					if( action == 'show' ) {
						$( '#pewc-group-' + group_id ).addClass( 'pewc-group-hidden' );
						$( '#pewc-tab-' + group_id ).addClass( 'pewc-group-hidden' );
					} else {
						$( '#pewc-group-' + group_id ).removeClass( 'pewc-group-hidden' );
						$( '#pewc-tab-' + group_id ).removeClass( 'pewc-group-hidden' );
					}
				}
			}

		}

		pewc_conditions.init();

	});

})(jQuery);
