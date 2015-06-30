/**
 * Libs
 */
var React = require('react');
var classNames = require('classnames');
var moment = require('moment');

/**
 * TopSitesCard
 */
var TopSitesCard = React.createClass({
  render: function(){
    var tupiqTopSitesClass = classNames({
    	'card tupiq__body--top-sites': true,
    });

    if (this.props.topSites.length > 6) {
    	this.props.topSites.length = 6;
    }

    var onClick = this.props.onClick;

    return (
			<div className={tupiqTopSitesClass}>
				<ul>
					{this.props.topSites.map(function(result, index) {
						return <li key={index}><a onClick={onClick} href={result.url} title={result.title}><img src={'http://www.google.com/s2/favicons?domain=' + result.url} /></a></li>;
					})}
				</ul>
			</div>
    )
  }
});

module.exports = TopSitesCard;
