//Start of v2 (requires jQuery)
class SimpleSlider
{
    static nextID = 1000;
    uniqueID;

    $images;
    $buttonContainer;
    jQueryReady = false;
    interval;
    speed;
    index = 0;
    displayAlt = false;
    interactive = true;
    showButtons = true;
    altTag = "h2";
    altClass = "";
    $altContainer;

    //just incase you want to stop and start it after creation
    stop()
    {
        window.clearInterval(this.interval);
    }
    start()
    {
        var si = this;
        this.interval = window.setInterval(function(){si.nextFrame()}, this.speed);
    }

    nextFrame(sliderInstance) 
    {
        //refresh slider
        sliderInstance.refresh();

        //advance index
        sliderInstance.index++

        //wrap if out of bounds
        if(sliderInstance.index >= sliderInstance.$images.length)
            sliderInstance.index = 0;
    }
    goFrame(index)
    {
        //set the current frame
        this.index = index;

        //update display
        this.refresh()
    }
    refresh()
    {
        //update buttons
        $(".bbSelected").removeClass("bbSelected") //remove indicator from current bullet
        $("#sliderButton_"+this.index).addClass("bbSelected"); //add indicator to new selection

        //hide all images
        this.$images.hide();
        this.$images.removeClass("selectedImg_sliderID"+this.uniqueID);

        //show display image at current index
        var instance = this;
        this.$images.each(function(i, elem){
           if(i === instance.index)
           {
                $(elem).show();
                $(elem).addClass("selectedImg_sliderID"+instance.uniqueID);
           }
        });

        //if enabled display alt text...
        if(this.displayAlt && this.$altContainer.length !== 0) //checks first if displayAlt is enabled, then makes sure there is a container for the alt text
        {
            let selector = '.selectedImg_sliderID'+this.uniqueID;
            this.$altContainer.html("<"+this.altTag+" class=\""+this.altClass+"\">"+$(selector).attr('alt')+"</"+this.altTag+">");
        }
    }

    constructor(c_imageClass, c_buttonContainerID, c_speed = 5000, options = {})
    {
        //assign a unique ID for this instance
        //allows more than one slider to exist per page
        this.uniqueID = SimpleSlider.nextID;
        SimpleSlider.nextID++;

        var sliderInstance = this;

        //check if jQuery is loaded
        if(typeof window.jQuery !== 'undefined')
        {
            this.jQueryReady = true;
        }
        else
        {
            console.log("SimpleSlider requires jQuery for it's core functionality, please ensure that jQuery is loaded before" +
                "continuing...");
            return;
        }

        //manditory settings
        this.$images = $("."+c_imageClass);
        this.$buttonContainer = $("#"+c_buttonContainerID);
        this.speed = c_speed;

        //optional settings
        //alt image display buttons
        if(options.displayAlt && options.altContainerID && typeof options.displayAlt === "boolean") this.displayAlt = options.displayAlt;
        if(options.altContainerID && typeof options.altContainerID === "string") this.$altContainer = $("#"+options.altContainerID);
        if(options.altTag && typeof options.altTag === "string") this.altTag = options.altTag;
        if(options.altClass && typeof options.altClass === "string") this.altClass = options.altClass;

        //interactivity and bullet buttons
        if(options.interactive && options.showButtons === true && typeof options.interactive === "boolean") this.interactive = options.interactive;
        if(options.showButtons && typeof options.showButtons === "boolean") this. showButtons = options.showButtons;

        //make buttons
        var buttonsHTML = "";
        this.$images.each(function(i)
        {
            buttonsHTML += "<a href=\"#\" class=\"bulletButton\" id=\"sliderButton_"+ i +"\">&bull;</a> ";
        });
        this.$buttonContainer.html(buttonsHTML)

        //make buttons clickable if interactive is enabled (default state)
        if(this.interactive)
        {
            $(".bulletButton").on("click", function(e, slider = sliderInstance)
            {
                //                                                               ˅ lol, I accidently made a face...
                var index = e.currentTarget.id.slice(e.currentTarget.id.indexOf("_")+1);
                
                //force js to treat as a number
                index++;
                index--;
                
                sliderInstance.goFrame(index);
            });
        }

        //timer
        this.refresh(); //show the first image
        this.interval = window.setInterval(function(){ sliderInstance.nextFrame(sliderInstance); }, this.speed);
    }
}

console.log("SimpleSlider ready.");