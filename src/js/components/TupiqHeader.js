/**
 * Libs
 */
var React = require('react');
var classNames = require('classnames');

/**
 * TupiqHeader
 */
var TupiqHeader = React.createClass({
  render: function(){
    var logoContainerClassName = classNames({
    	'tupiq__header__logo-container': true,
    	'loading': this.props.isBackgroundLoading
    });

    return (
      <div className="tupiq__header" onMouseDown={this.props.onMouseDown}>
        <div className={logoContainerClassName}>
	        <img src="images/tupiq-logo.svg" className="tupiq__header__logo-container__tupiq-logo" onClick={this.props.onClick} />
	      </div>
      </div>
    )
  }
});

module.exports = TupiqHeader;
