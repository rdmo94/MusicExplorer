
export function graph_data_prettyfier(text){
    //TODO function that prettyfies genres by replacing correct characters, uppercases etc
    function replaceAll(str, find, replace) {
      return str.replace(new RegExp(find, 'g'), replace);
    }
    
    text = replaceAll(text, "____","&")
    text = replaceAll(text, "___", "'")
    text = replaceAll(text, "__", "-")
    text = replaceAll(text, "_", " ")
  
    text = text.toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
    return text
  }

  export function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }