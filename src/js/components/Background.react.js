var React = require('react');

var Background = React.createClass({
  render: function(){
    var style = {};

    style.backgroundImage = 'url(' + this.props.backgroundImage.data + ')';

    return (
      <div className="background" style={style}></div>
    );
  }
});

module.exports = Background;
