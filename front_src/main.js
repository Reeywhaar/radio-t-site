import "./style.scss";
import "./libs/likely/likely.css";

if (document.title !== "Слушать Online вещание") {
	audiojs.events.ready(function() {
		audiojs.createAll();
	});
}
