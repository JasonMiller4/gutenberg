/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { withPluginContext } from '@wordpress/plugins';
import { check } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import PluginMoreMenuItem from '../plugin-more-menu-item';

const PluginSidebarMoreMenuItem = ( {
	children,
	icon,
	isSelected,
	onClick,
} ) => (
	<PluginMoreMenuItem
		icon={ isSelected ? check : icon }
		isSelected={ isSelected }
		role="menuitemcheckbox"
		onClick={ onClick }
	>
		{ children }
	</PluginMoreMenuItem>
);

/**
 * Renders a menu item in `Plugins` group in `More Menu` drop down,
 * and can be used to activate the corresponding `PluginSidebar` component.
 * The text within the component appears as the menu item label.
 *
 * @param {Object} props Component props.
 * @param {string} props.target A string identifying the target sidebar you wish to be activated by this menu item. Must be the same as the `name` prop you have given to that sidebar.
 * @param {WPBlockTypeIconRender} [props.icon=inherits from the plugin] The [Dashicon](https://developer.wordpress.org/resource/dashicons/) icon slug string, or an SVG WP element, to be rendered to the left of the menu item label.
 *
 * @example <caption>ES5</caption>
 * ```js
 * // Using ES5 syntax
 * var __ = wp.i18n.__;
 * var PluginSidebarMoreMenuItem = wp.editPost.PluginSidebarMoreMenuItem;
 * var moreIcon = wp.element.createElement( 'svg' ); //... svg element.
 *
 * function MySidebarMoreMenuItem() {
 * 	return wp.element.createElement(
 * 		PluginSidebarMoreMenuItem,
 * 		{
 * 			target: 'my-sidebar',
 * 			icon: moreIcon,
 * 		},
 * 		__( 'My sidebar title' )
 * 	)
 * }
 * ```
 *
 * @example <caption>ESNext</caption>
 * ```jsx
 * // Using ESNext syntax
 * import { __ } from '@wordpress/i18n';
 * import { PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
 * import { more } from '@wordpress/icons';
 *
 * const MySidebarMoreMenuItem = () => (
 * 	<PluginSidebarMoreMenuItem
 * 		target="my-sidebar"
 * 		icon={ more }
 * 	>
 * 		{ __( 'My sidebar title' ) }
 * 	</PluginSidebarMoreMenuItem>
 * );
 * ```
 *
 * @return {WPComponent} The component to be rendered.
 */
export default compose(
	withPluginContext( ( context, ownProps ) => {
		return {
			icon: ownProps.icon || context.icon,
			sidebarName: `${ context.name }/${ ownProps.target }`,
		};
	} ),
	withSelect( ( select, { sidebarName } ) => {
		const { getActiveGeneralSidebarName } = select( 'core/edit-post' );

		return {
			isSelected: getActiveGeneralSidebarName() === sidebarName,
		};
	} ),
	withDispatch( ( dispatch, { isSelected, sidebarName } ) => {
		const { closeGeneralSidebar, openGeneralSidebar } = dispatch(
			'core/edit-post'
		);
		const onClick = isSelected
			? closeGeneralSidebar
			: () => openGeneralSidebar( sidebarName );

		return { onClick };
	} )
)( PluginSidebarMoreMenuItem );
