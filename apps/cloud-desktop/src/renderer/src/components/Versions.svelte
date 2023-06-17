<script lang="ts">
  const versions = window.electron.process.versions
</script>

<ul class="list">
  <li>Electron v{ versions.electron }</li>
  <li>Chromium v{ versions.chrome }</li>
  <li>Node v{ versions.node }</li>
  <li>V8 v{ versions.v8 }</li>
</ul>

<iframe src="#/iframe?naked=false" />
