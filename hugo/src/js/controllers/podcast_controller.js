import Controller from '../base_controller';
import Player from './player_controller';

/**
 * @property playButtonTarget
 * @property {Audio} audioTarget
 */
export default class extends Controller {
  static targets = ['playButton', 'number', 'cover', 'audio'];

  connect() {
    super.connect();
    // Set up audio target
    const audio = this.element.querySelector('audio');
    if (audio && audio.src) {
      audio.dataset.target = `${this.identifier}.audio`;
      this.playButtonTarget.classList.remove('d-none');
      this.element.classList.add('has-audio');
    }
    this.fetchState();
  }

  fetchState() {
    this.debug(Player.getState().src, this.getPodcastInfo().src);
    this.element.classList.toggle('playing',
      Player.getState().src === this.getPodcastInfo().src
      && Player.getState().paused === false
    );
  }

  play(e, timeLabel = null) {
    e.preventDefault();
    e.stopPropagation();

    this.dispatchEvent(this.element, new CustomEvent('podcast-play', {
      bubbles: true,
      detail: {
        ...this.getPodcastInfo(),
        ...(timeLabel ? {timeLabel} : {}),
      }
    }));

    setTimeout(() => {
      this.fetchState();
    }, 50);
  }

  goToTimeLabel(e) {
    this.play(e, e.target.textContent);
  }

  getPodcastInfo() {
    return {
      src: this.audioTarget.src,
      url: this.data.get('url'),
      image: this.coverTarget.style.backgroundImage,
      number: this.numberTarget.textContent,
    };
  }
}
