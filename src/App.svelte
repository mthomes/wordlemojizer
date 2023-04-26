<script lang="ts">
  import IconArrow from './icons/IconArrow.svelte';
  import IconCopy from './icons/IconCopy.svelte';
  import IconPaste from './icons/IconPaste.svelte';

  let emptySpace: string;
  let partialSpace: string;
  let fullSpace: string;
  let scoreStart: string = '';
  let scoreOutput: string = '';
  let isPlaying: boolean = false;

  $: {
    scoreOutput = scoreStart.replaceAll('⬜', emptySpace || '⬜');
    scoreOutput = scoreOutput.replaceAll('⬛', emptySpace || '⬛');
    scoreOutput = scoreOutput.replaceAll('🟨', partialSpace || '🟨');
    scoreOutput = scoreOutput.replaceAll('🟩', fullSpace || '🟩');
  }

  async function handleOnPaste() {
    try {
      const text = await navigator.clipboard.readText();

      scoreStart = text;
    } catch (error) {
      console.error(error);
    }
  }

  async function handleOnClickCopy() {
    try {
      await navigator.clipboard.writeText(scoreOutput);
      isPlaying = true;
    } catch (error) {
      console.error(error);
    }
  }

  function handleResetAnimation() {
    isPlaying = false;
  }
</script>

<main>
  <h1>WordleMojizer</h1>

  <form class="replacerForm" autocomplete="off">
    <div class="replacer">
      <label
        class="replacerLabel replacerLabel-empty"
        for="empty"
        aria-label="Empty Space"
      >
        <IconArrow />
      </label>
      <input
        class="replacerInput"
        type="text"
        name="empty"
        id="empty"
        bind:value={emptySpace}
      />
    </div>
    <div class="replacer">
      <label
        class="replacerLabel replacerLabel-partial"
        for="yellow"
        aria-label="Partial Match"
      >
        <IconArrow />
      </label>
      <input
        class="replacerInput"
        type="text"
        name="yellow"
        id="yellow"
        bind:value={partialSpace}
      />
    </div>
    <div class="replacer">
      <label
        class="replacerLabel replacerLabel-full"
        for="green"
        aria-label="Full Match"
      >
        <IconArrow />
      </label>
      <input
        class="replacerInput"
        type="text"
        name="green"
        id="green"
        bind:value={fullSpace}
      />
    </div>
  </form>
  <div class="fields">
    <div class="field">
      <pre class="score">{scoreStart}</pre>
      <button
        class="clipboardButton"
        type="button"
        on:click={handleOnPaste}
        aria-label="Paste"
      >
        <IconPaste />
      </button>
    </div>
    <div class="field">
      <pre class="score">{scoreOutput}</pre>
      <button
        class="clipboardButton"
        type="button"
        on:click={handleOnClickCopy}
        disabled={!scoreOutput}
        aria-label="Copy"
      >
        <IconCopy />
      </button>
    </div>
  </div>
  <div
    on:animationend={handleResetAnimation}
    class="animationContainer"
    class:play={isPlaying}
  >
    <pre class="animationOutput">{scoreOutput}</pre>
  </div>
</main>
