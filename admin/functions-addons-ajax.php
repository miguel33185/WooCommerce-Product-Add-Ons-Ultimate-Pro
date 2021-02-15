<?php
/**
 * Functions for loading add-ons via AJAX
 * @since 3.3.0
 * @package WooCommerce Product Add-Ons Ultimate
 */

// Exit if accessed directly
if( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Are we using AJAX to load the add-ons?
 */
function pewc_enable_ajax_load_addons() {
	return apply_filters( 'pewc_enable_ajax_load_addons', false );
}

function pewc_load_addons() {
	ob_start();
	$post_id = $_POST['post_id'];
	$groups = pewc_get_extra_fields( $post_id );
	pewc_display_product_groups( $groups, $post_id, true );
	wp_die();
}
add_action( 'wp_ajax_pewc_load_addons', 'pewc_load_addons' );


function get_product_attr(){
	$product_id = $_POST['product_id'];
	$_product = wc_get_product( $product_id );
	$_attributes = $_product->get_attributes();		
	$attribute_ids = array();
	$attribute_names = array();
	$attribute_keys = array();
	
	foreach ($_attributes as $attr=>$attr_deets) {		
		array_push($attribute_names, wc_attribute_label($attr));
		array_push($attribute_ids, $attr_deets['id']);
		array_push($attribute_keys, $attr);
	}
	$data = array("ids"=>$attribute_ids, "names"=>$attribute_names, "keys"=>$attribute_keys);
	
	if( count($attribute_names) > 0 ){
		$response['status'] = 'success';		
		$response['data'] = $data;
		
	}else{
		$response['status'] = 'error';		
		$response['data'] = $data;		
	}
	echo json_encode($response);
	exit;
}
add_action( 'wp_ajax_get_product_attr', 'get_product_attr' );    // If called from admin panel
add_action( 'wp_ajax_nopriv_get_product_attr', 'get_product_attr' );    // If called from front end