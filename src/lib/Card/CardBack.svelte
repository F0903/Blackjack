<div class="card-back">
  <div class="stripes-container">
    <div class="card-back-stripe"></div>
    <div class="card-back-stripe"></div>
    <div class="card-back-stripe"></div>
    <div class="card-back-stripe"></div>
    <div class="card-back-stripe"></div>
    <div class="card-back-stripe"></div>
    <div class="card-back-stripe"></div>
    <div class="card-back-stripe"></div>
    <div class="card-back-stripe"></div>
  </div>
</div>

<style>
  .stripes-container {
    display: flex;
    flex-direction: column;
    place-content: center;
    place-items: center;
    justify-content: space-between;

    height: 100%;

    rotate: 40deg;
  }

  .card-back-stripe {
    background-color: var(--card-red);

    width: 200%;
    height: 5px;
  }

  .card-back {
    width: 100%;
    height: 100%;
    overflow: hidden;

    border-radius: var(--card-border-radius);
  }
</style>
