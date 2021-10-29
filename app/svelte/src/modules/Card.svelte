


<style>
    .card{
        width: 60%;
        padding:    30px;
        background-color: white;
        transition: width 0.3s;
        margin: auto;
        position: relative;
        border-radius: 15px;
        max-width: 400px;
        font-family: "Roboto", sans-serif;
        
    }

    .card h1{
        text-align: center;
        color: black;
        
    }
    .card p{
        padding: 8px;
        width: 80%;
        color: black;
        display: block;
        margin: 20px 10%;
    }

    .box_shadow_light{
        box-shadow:
            2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02),
            6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028),
            12.5px 12.5px 10px rgba(0, 0, 0, 0.035),
            22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042),
            41.8px 41.8px 33.4px rgba(0, 0, 0, 0.05),
            100px 100px 80px rgba(0, 0, 0, 0.07);
    }
</style>

<div class="card box_shadow_light">
    <slot>
        <em>
            <h1>No Card Content Provided.</h1>
            <p>There was no card content provided.</p>
        </em>
    </slot>
</div>
