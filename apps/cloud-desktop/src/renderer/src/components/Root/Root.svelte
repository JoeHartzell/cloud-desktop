<script lang="ts">
  import { App } from '../App'
  import { Module } from '../Module'
  import { AWS } from '../../context/AWS'
  import Router, { replace, location } from 'svelte-spa-router'

  const routes = {
    '/app/*': App,
    '/module/*': Module,
  }

  console.log($location)
  // redirect to /app/ when the app is loaded
  if ($location === '/') {
    console.log('redirecting')
    replace('/app/login')
  }
</script>

<AWS>
  <Router {routes} />
</AWS>
