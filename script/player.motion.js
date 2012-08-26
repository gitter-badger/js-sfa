﻿Player.prototype.IsFacingLeft = function() { return this.direction_ > 0; }
Player.prototype.GetDistanceFromSq = function(x,y)
{
    var dx = x-this.GetMidX();
    var dy = y-this.GetMidY();

    var distSq = dx*dx + dy*dy;

    return distSq;
}
Player.prototype.GetMidX = function()
{
    var left = this.GetLeftX();
    var right = this.GetRightX();

    return right - ((right-left)/2);
}
Player.prototype.GetMidY = function()
{
    var bottom = this.GetOffsetBoxBottom();
    var top = this.GetBoxTop();

    return top - ((top-bottom)/2);
}

Player.prototype.GetLeftX = function(useImageWidth) { if(this.direction_ > 0){return STAGE.MAX_STAGEX - (this.GetX() + (!!useImageWidth ? this.GetBoxWidth() : this.GetConstWidth()));}else{return this.GetX();}}
Player.prototype.GetRightX = function(useImageWidth)  { if(this.direction_ > 0){return STAGE.MAX_STAGEX - this.GetX();}else{return this.GetX() + (!!useImageWidth ? this.GetBoxWidth() : this.GetConstWidth());}}
Player.prototype.GetAbsFrontX = function(useImageWidth) { if(this.direction_ > 0){ return this.GetLeftX(useImageWidth); } else { return this.GetRightX(useImageWidth); } }
Player.prototype.GetAbsBackX = function(useImageWidth)  { if(this.direction_ > 0){ return this.GetRightX(useImageWidth); } else { return this.GetLeftX(useImageWidth); } }

Player.prototype.GetBoxTop = function() { return this.y_ + (this.GetBoxHeight()); }
Player.prototype.GetConstOffsetTop = function() { return this.height_ + game_.match_.stage_.GetGroundY(); }
Player.prototype.GetOffsetBoxTop = function() { return this.y_ + (this.GetBoxHeight()) + this.yTopOffset_; }
Player.prototype.GetBoxBottom = function() { return this.y_; }
Player.prototype.GetOffsetBoxBottom = function() { return this.y_ + this.yBottomOffset_; }
/*Player.prototype.GetConstWidth = function() { return (!!this.currentAnimation_ && !!this.currentAnimation_.Animation && !!this.currentAnimation_.Animation.IsAttack()) ? this.GetBoxWidth() : this.width_; }*/
Player.prototype.GetConstHeight = function() { return this.height_; }
Player.prototype.GetConstWidth = function() { return this.width_; }
Player.prototype.GetConstFrontX = function() { return this.GetX() + this.GetConstWidth(); }
Player.prototype.GetFrontX = function() { return this.GetX() + this.GetBoxWidth(); }
Player.prototype.GetBoxWidth = function() { return parseInt(this.element_.style.width); }
Player.prototype.GetBoxHeight = function() { return parseInt(this.spriteElement_.style.height); }
Player.prototype.GetRect = function(useImageWidth)
{
    return {Left:this.GetLeftX(useImageWidth),Right:this.GetRightX(useImageWidth),Top:this.GetOffsetBoxTop(),Bottom:this.GetOffsetBoxBottom()};
}
/*
Player.prototype.GetRight = function() { return parseInt(this.element_.style.right || 0); }
Player.prototype.GetLeft = function() { return parseInt(this.element_.style.left || 0); }
Player.prototype.GetY = function() { return parseInt(this.element_.style.bottom) || 0; }
Player.prototype.GetX = function() { if(this.direction_ > 0){return this.GetRight();} else {return this.GetLeft();} }
*/
Player.prototype.GetRight = function() { return this.x_; }
Player.prototype.GetLeft = function() { return this.x_; }
Player.prototype.GetY = function() { return this.y_ || 0; }
Player.prototype.GetX = function() { return this.x_ || 0; }

Player.prototype.SetRight = function(value) { this.element_.style.right = (value) + "px";}
Player.prototype.SetLeft = function(value) { this.element_.style.left = (value) + "px";}

Player.prototype.SetY = function(value)
{
    this.y_ = Math.max(value,game_.match_.stage_.GetGroundY());
    this.MoveCircle();
}
Player.prototype.SetX = function(value)
{
    if(this.y_ == game_.match_.stage_.GetGroundY())
        value = Math.min(Math.max(value,0),STAGE.MAX_STAGEX - (this.pendingWidth_ || 0));
    else
        value = Math.min(Math.max(value,0),STAGE.MAX_STAGEX - (this.pendingWidth_ || 0) * 0.8);
    this.x_ = value;
    this.MoveCircle();
}
Player.prototype.Show = function() { this.SetDisplay(true); }
Player.prototype.Hide = function() { this.SetDisplay(false); }
Player.prototype.SetDisplay = function(isVisible)
{
    if(!!isVisible)
    {
        this.element_.style.display = "";
        this.shadowContainer_.style.display = "";
    }
    else
    {
        this.element_.style.display = "none";
        this.shadowContainer_.style.display = "none";
    }
}
Player.prototype.AlignX = function(deltaX) { this.x_ += (deltaX * -this.direction_); }

Player.prototype.SetImageX = function(value) {if(this.direction_ > 0){this.spriteElement_.style.right = value+"px"; } else {this.spriteElement_.style.left = value+"px";}}
Player.prototype.SetImageY = function(value) { this.spriteElement_.style.bottom = value+"px"; }
Player.prototype.IsCrouching = function() { return this.Flags.Pose.Has(POSE_FLAGS.CROUCHING); }
Player.prototype.IsOnGround = function() { return this.y_ == game_.match_.stage_.GetGroundY(); }
Player.prototype.IsAirborne = function() { return this.Flags.Pose.Has(POSE_FLAGS.AIRBORNE) || this.Flags.Pose.Has(POSE_FLAGS.AIRBORNE_FB) || this.y_ > game_.match_.stage_.GetGroundY(); }
Player.prototype.AlignY = function(groundY)
{
    if(this.y_ != groundY && !(this.Flags.Pose.Has(POSE_FLAGS.AIRBORNE) || this.Flags.Pose.Has(POSE_FLAGS.AIRBORNE_FB)))
    {
        this.y_ = groundY;
    }
}
Player.prototype.IsDescending = function() { return this.lastFrameY_ > this.constY_; }
Player.prototype.IsVisible = function() { return !this.Flags.Player.Has(PLAYER_FLAGS.INVISIBLE); }
Player.prototype.IsTeleporting = function() { return !!this.IsTeleportingStarting() || !!this.IsTeleportingEnding(); }
Player.prototype.IsTeleportingStarting = function() { return !!this.currentAnimation_ && !!this.currentAnimation_.Animation && !!(this.currentAnimation_.Animation.Flags.Combat & COMBAT_FLAGS.TELEPORT_START); }
Player.prototype.IsTeleportingEnding = function()   { return !!this.currentAnimation_ && !!this.currentAnimation_.Animation && !!(this.currentAnimation_.Animation.Flags.Combat & COMBAT_FLAGS.TELEPORT_END); }
Player.prototype.JumpedOverAPlayer = function() { return this.IsAirborne() && this.IsDescending() && !!this.mustChangeDirection_; }
Player.prototype.CanBeJuggled = function()
{
    return this.IsAirborne()
        && !!this.currentAnimation_.Animation
        && !!this.currentAnimation_.Animation.AllowJuggle
    ;
}
Player.prototype.SetDirection = function(value)
{
    if(value != this.direction_)
        this.ChangeDirection();
}
Player.prototype.TurnAround = function()
{
    this.mustChangeDirection_ = 1;
}


Player.prototype.CheckMustChangeDirection = function()
{
    if(!!this.mustChangeDirection_ && !this.IsDead())
    {
        this.ChangeDirection();
    }
}

Player.prototype.ChangeDirection = function(quick)
{
    this.mustChangeDirection_ = 0;
    var pnlStageWidth = STAGE.CSSWIDTH;
    var imgWidth = parseInt(this.spriteElement_.style.width) || 0;


    /*facing left*/
    if(this.IsFacingLeft())
    {
        var x = this.GetRight() + imgWidth;
        var left = pnlStageWidth - x;
        this.SetX(left);

        this.spriteElement_.style.right = "";
        this.spriteElement_.style.left = "0px";

        this.element_.style.right = "";
        this.element_.style.left = left + "px";

        this.shadowContainer_.style.right = "";
        this.shadowContainer_.style.left = left + "px";

        this.shadow_.style.left = this.spriteElement_.style.left;
        this.shadow_.style.right = "";

        this.direction_ = -1;
        /*swap the left and right buttons*/
        this.buttons_[this.leftKey_].Bit = 2;
        this.buttons_[this.rightKey_].Bit = 1;
        this.Flip(true);
    }
    else
    {
        var x = this.GetLeft() + imgWidth;
        var right = pnlStageWidth - x;
        this.SetX(right);

        this.spriteElement_.style.left = "";
        this.spriteElement_.style.right = "0px";
        
        this.element_.style.left = "";
        this.element_.style.right = right + "px";

        this.shadowContainer_.style.left = "";
        this.shadowContainer_.style.right = right + "px";

        this.shadow_.style.left = "";
        this.shadow_.style.right = this.spriteElement_.style.right;

        this.direction_ = 1;
        /*swap the left and right buttons*/
        this.buttons_[this.leftKey_].Bit = 1;
        this.buttons_[this.rightKey_].Bit = 2;
        this.Flip(false);
    }
    if(!quick)
    {
        if(this.Flags.Pose.Has(POSE_FLAGS.CROUCHING))
        {
            var move = this.moves_[_c3("_",POSE_FLAGS.CROUCHING,"_turn")];
            this.SetCurrentAnimation({Animation:move,StartFrame:game_.GetCurrentFrame(),Direction:this.direction_});
        }
        else
        {
            var move = this.moves_[_c3("_",POSE_FLAGS.STANDING|POSE_FLAGS.WALKING_FORWARD|POSE_FLAGS.WALKING_BACKWARD,"_turn")];
            this.SetCurrentAnimation({Animation:move,StartFrame:game_.GetCurrentFrame(),Direction:this.direction_});
        }
    }

    for(var i = 0; i < this.keyStates_.length; ++i)
    {
        if(!!(this.keyStates_[i].Bit & (1 << 0)))
            this.keyStates_[i].Bit = this.keyStates_[i].Bit ^ (1 << 0) | (1 << 1);
        else if(!!(this.keyStates_[i].Bit & (1 << 1)))
            this.keyStates_[i].Bit = this.keyStates_[i].Bit ^ (1 << 1) | (1 << 0);
    }
    if(!!(this.keyState_ & (1 << 0)))
        this.keyState_ ^= (1 << 0) | (1 << 1);
    else if(!!(this.keyState_ & (1 << 1)))
        this.keyState_ ^= (1 << 1) | (1 << 0);
}
Player.prototype.MoveCircleToBottom = function()
{
    this.MoveCircle();
    this.circle_.RenderY = this.y_ + this.circle_.OffsetY;
}
Player.prototype.MoveCircleToTop = function()
{
    this.MoveCircle();
    this.circle_.RenderY = this.GetBoxTop() - this.circle_.R*2 - this.circle_.OffsetY;
}
Player.prototype.MoveCircle = function()
{
    var x = 0;
    if(this.direction_ < 0)
        x = this.GetX();
    else
        x = STAGE.MAX_STAGEX - this.GetX();
    if(!!this.currentFrame_ && !!this.pendingWidth_)
    {
        //this.circle_.R = (this.pendingWidth_ + (this.currentFrame_.ImageOffsetX || 0)) / 2;
        //this.circle_.RSq = this.circle_.R * this.circle_.R;
    }
    if(this.direction_ == -1)
        this.circle_.RenderX = x + this.circle_.R;
    else
        this.circle_.RenderX = x - this.circle_.R;


    this.circle_.LocalY = this.circle_.R;
    this.circle_.LocalX = this.circle_.R;

}
Player.prototype.MoveY = function(amount,forced)
{
    var deltaY = this.moveYFn_(amount,forced);
    var y = this.GetY() + deltaY;
    this.SetY(y);
    return deltaY;
}
Player.prototype.OffsetImageX = function(amount)
{
    this.SetImageX(amount);
}
Player.prototype.OffsetImageY = function(amount)
{
    this.SetImageY(amount);
}
/*sets the target to which the player will teleport*/
Player.prototype.SetTeleportTarget = function(flag,nbFrames)
{
    var foe = this.GetTarget();
    if(foe)
    {
        this.teleportFramesLeft_ = nbFrames;
        this.teleport0GapX_ = "";
        this.teleportX_ = 0;
        switch(flag)
        {
            case COMBAT_FLAGS.TELEPORT_BEHIND:  { this.teleportX_ = (STAGE.MAX_STAGEX - foe.x_) / nbFrames; this.teleport0GapX_ = "b"; break; }
            case COMBAT_FLAGS.TELEPORT_INFRONT: { this.teleportX_ = (STAGE.MAX_STAGEX - foe.x_ - foe.offsetWidth_ - this.offsetWidth_) / nbFrames; this.teleport0GapX_ = "f"; break; }
            case COMBAT_FLAGS.TELEPORT_MIDDLE:  { this.teleportX_ = ((STAGE.MAX_STAGEX - foe.x_ - foe.offsetWidth_ - this.offsetWidth_) / nbFrames)/2; this.teleport0GapX_ = "m"; break; }
            case COMBAT_FLAGS.TELEPORT_BACK:    { this.teleportX_ = (0 - this.x_) / nbFrames; this.teleport0GapX_ = "bw"; break; }
        }
        this.teleportX_ /= 2;
    }
}

/*Advances the players teleportation. If this is the last movement, the player is warper to his final position*/
Player.prototype.AdvanceTeleportation = function()
{
    if(!!this.teleportFramesLeft_)
    {
        var foe = this.GetTarget();
        --this.teleportFramesLeft_;
        if(this.teleportFramesLeft_ <= 0)
        {
            this.teleportX_ = 0;
            if(!!(this.currentAnimation_.Animation.Flags.Combat & COMBAT_FLAGS.TELEPORT_END) && !!this.teleport0GapX_)
            {
                if(foe)
                {
                    var otherRect = foe.GetRect();
                    var buffer = 1.5;
                    var midBuffer = 0.35;
                    var x = this.x_;
                    switch(this.teleport0GapX_)
                    {
                        case "f": /*must end up infront of the enemy*/
                        {
                            x = this.direction_ == -1 ? x = otherRect.Left - this.offsetWidth_ * buffer : (STAGE.MAX_STAGEX - otherRect.Right) - this.offsetWidth_ * buffer;
                            break;
                        }
                        case "b": /*must end up behind enemy*/
                        {
                            x = this.direction_ == -1 ? x = otherRect.Right : x = STAGE.MAX_STAGEX - otherRect.Left;
                            break;
                        }
                        case "bw": /*back wall*/
                        {
                            x = 0;
                            break;
                        }
                        case "m": /*mid screen*/
                        {
                            x = this.direction_ == -1 ? otherRect.Left * midBuffer : (STAGE.MAX_STAGEX - otherRect.Right) * midBuffer;
                            break;
                        }
                    }
                    this.SetX(x);
                }
            }
        }
        else
        {
            if(!foe || !game_.match_.GetPhysics().IsWithinDistanceX(this,foe,CONSTANTS.MIN_TELEPORT_DISTANCE_SQ))
                this.MoveX(this.teleportX_);
        }
    }
}

Player.prototype.MustChangeDirection = function(recheck)
{
    if(!this.mustChangeDirection_ || !!recheck)
    {
        if((this.direction_ == 1) && this.GetPhysics().IsAnyPlayerFromOtherTeamMoreLeft(this.GetMidX(),this.team_) === false)
            return true;
        else if((this.direction_ == -1) && this.GetPhysics().IsAnyPlayerFromOtherTeamMoreRight(this.GetMidX(true),this.team_) === false)
            return true;
    }

    if(!!recheck)
        this.mustChangeDirection_ = false;

    return false;
}
Player.prototype.CheckDirection = function()
{
    if(this.MustChangeDirection())
        this.TurnAround();
}
/*player faces his target*/
Player.prototype.FaceTarget = function()
{
    var otherFront = 0;
    var otherBack = 0;

    var myFront = 0;
    var myBack = 0;


    if(this.team_ == 1)
    {
        otherFront = this.GetMatch().GetTeamB().GetPlayer(this.target_).GetAbsFrontX();
        otherBack = this.GetMatch().GetTeamB().GetPlayer(this.target_).GetAbsBackX();

        myFront = this.GetAbsFrontX();
        myBack = this.GetAbsBackX();
    }
    else
    {
        otherFront = this.GetMatch().GetTeamA().GetPlayer(this.target_).GetAbsFrontX();
        otherBack = this.GetMatch().GetTeamA().GetPlayer(this.target_).GetAbsBackX();

        myFront = this.GetAbsFrontX();
        myBack = this.GetAbsBackX();
    }

    if((myFront < otherFront) && (this.direction_ != -1) && (!this.mustChangeDirection_))
        this.TurnAround();
    else if((myBack > otherBack) && (this.direction_ != 1) && (!this.mustChangeDirection_))
        this.TurnAround();
}
Player.prototype.TargetLastAttacker = function()
{
    if(!!this.registeredHit_.OtherPlayer)
    {
        this.target_ = this.registeredHit_.OtherPlayer.GetIndex();
        this.FaceTarget();
    }
}
/*moves the player in the stage*/
Player.prototype.MoveX = function(amount)
{
    if(!amount)
        return 0;
    var x = this.GetX();
    var deltaX = this.moveXFn_(amount);
    x += deltaX;

    //this.SetX(x);
    return deltaX;
}
/*warps the player to a new location - no collision detection is done*/
Player.prototype.WarpX = function(amount,autoDir)
{
    if(!!autoDir)
    {
        if(amount > 0) /*moving right*/
        {
            if(this.direction_ == -1)
                amount = Math.abs(amount);
            else
                amount = -Math.abs(amount);
        }
        else /*moving left*/
        {
            if(this.direction_ == -1)
                amount = -Math.abs(amount);
            else
                amount = Math.abs(amount);
        }
    }
    var oldX = this.GetMidX();
    this.SetX(this.x_ + amount);
    return this.GetMidX() - oldX;
}

Player.prototype.WarpY = function(amount)
{
    var oldY = this.y_;
    this.SetY(this.y_ + amount);

    return this.y_ - oldY;
}

Player.prototype.ConvertX = function(x)
{
    if(this.direction_ < 0)
        return STAGE.MAX_STAGEX - this.GetBoxWidth() - x
    else
        return STAGE.MAX_STAGEX - this.GetBoxWidth() - x;
}

Player.prototype.ConvertY = function(y)
{
    return y;
}
Player.prototype.IsLeftCornered = function(x)
{
    var rect = this.GetRect();
    return rect.Left <= STAGE.MIN_X;

    x = x || this.GetX();
    var retVal = false;
    if(this.direction_ < 0 && x <= STAGE.MIN_X)
        retVal = true;
    else if(this.direction_ > 0 && x >= STAGE.MAX_STAGEX - (this.pendingWidth_ || 0))
        retVal = true;
    return retVal;
}
Player.prototype.IsLeftCorneredInStage = function(x)
{
    return this.IsLeftCornered() && this.GetStage().IsLeftCornered();
}
Player.prototype.IsRightCornered = function(x)
{
    var rect = this.GetRect();
    return rect.Right >= STAGE.MAX_STAGEX;

    x = x || this.GetX();
    var retVal = false;
    if(this.direction_ < 0 && x >= STAGE.MAX_STAGEX - (this.pendingWidth_ || 0))
        retVal = true;
    else if(this.direction_ > 0 && x <= STAGE.MIN_X)
        retVal = true;
    return retVal;
}
Player.prototype.IsRightCorneredInStage = function(x)
{
    return this.IsRightCornered() && this.GetStage().IsRightCornered();
}
/*Shows the dirt animation when a player is floored*/
Player.prototype.ShowBigDirt = function(frame)
{
    for(var i = 0; i < 4; ++i)
    {
        this.SpawnBigDirt(frame,i * 40);
    }
}
/*Shows the small dirt animation when a player is floored*/
Player.prototype.ShowSmallDirt = function(frame)
{
    for(var i = 0; i < 4; ++i)
    {
        this.SpawnSmallDirt(frame,20 + (i * 30));
    }
}
/*Puts a player in sliding motion*/
Player.prototype.StartSlide = function(frame,amount,direction,fx,hideSlideDirt,forceSlide)
{
    if(!forceSlide && !!this.currentAnimation_.Animation.Flags.Combat && !!(this.currentAnimation_.Animation.Flags.Combat & COMBAT_FLAGS.NO_SLIDE_BACK))
        return this.StopSlide();

    if(this.isSliding_)
    {
        this.t_ = 0;
        this.fx_ = Math.sin(this.t_) * amount;
    }

    if(!!hideSlideDirt)
        this.showSlideDirt_ = false;

    if((this.direction_ > 0 && direction < 0) || (this.direction_ < 0 && direction > 0))
        this.slideFactor_ = Math.abs(amount) * fx;
    else if((this.direction_ > 0 && direction > 0) || (this.direction_ < 0 && direction < 0))
        this.slideFactor_ = -Math.abs(amount) * fx;

    this.isSliding_ = true;
}
/*Handles the player sliding*/
Player.prototype.Slide = function(frame)
{
    if(!!this.frameFreeze_ && !this.IsBlocking())
        return;
    if(this.t_ >= CONSTANTS.HALF_PI || !this.isSliding_ || !!this.IsBeingGrappled())
    {
        this.StopSlide();
        return;
    }
    this.t_ = Math.min(this.t_ + CONSTANTS.SLIDE_INC, CONSTANTS.HALF_PI);
    this.lastFx_ = this.fx_;
    this.fx_ =  Math.sin(this.t_) * this.slideFactor_;
    ++this.slideCount_;

    if(!!this.showSlideDirt_)
    {
        if(this.slideCount_ % CONSTANTS.DIRT_FREQUENCY == 0)
        {
            this.SpawnSmallDirt(frame);
        }
    }

    var deltaX = (this.lastFx_ - this.fx_);
    
    if(this.IsOnGround())
        this.MoveX(deltaX);
    else
        this.slideFactor_ *= 0.5;
    
}

Player.prototype.StopSlide = function()
{
    if(!!this.isSliding_)
    {
        this.t_ = 0;
        this.fx_ = 0;
        this.slideCount_ = 0;
        this.isSliding_ = false;
        this.showSlideDirt_ = true;
    }
}
/*calculates the next position of the players jump*/
Player.prototype.AdvanceJump = function(ignoreYCheck)
{
    //this.x1 = this.x0_ + ((this.jumpVelocityX_ * this.jumpT_) * 0.1);
    var y = this.y0_ + ((this.jumpVelocityY_ * this.jumpT_) - ((CONSTANTS.HALF_G) * (this.jumpT_*this.jumpT_))) * CONSTANTS.Y_DAMPING;

    if(!!(this.Flags.Pose.Has(POSE_FLAGS.HOLD_AIRBORNE)))
    {
        this.HoldJump();
    }

    ++this.jumpT_;

    var dx = this.jumpVelocityX_ * CONSTANTS.X_DAMPING;
    var dy = y - this.oldY_;

    if(!!this.VxFn)
        dx = this.VxFn(dx,this.jumpT_);
    if(!!this.VyFn)
        dy = this.VyFn(dy,this.jumpT_);

    this.oldY_ = y;

    this.MoveX(dx);
    this.MoveY(dy);

    if(!ignoreYCheck && this.GetY() <= game_.match_.stage_.GetGroundY())
    {
        this.Flags.Pose.Remove(POSE_FLAGS.AIRBORNE);
        this.Flags.Pose.Remove(POSE_FLAGS.AIRBORNE_FB);
        this.VxFn = null;
        this.VyFn = null;
        this.jumpT_ = 0;
        return false;
    }
    return true;
}

Player.prototype.PerformJump = function(vx,vy,vxFn,vyFn)
{
    /*store the X and Y modifier functions*/
    this.SetVxFn(vxFn);
    this.SetVyFn(vyFn);
    /*store the initial position*/
    this.x0_ = this.x_;
    this.y0_ = this.y_;
    this.oldY_ = this.y_;
    this.jumpVelocityX_ = vx;
    this.jumpVelocityY_ = vy;
    this.jumpT_ = 0;
    /*store the velocity*/
    /*store a timer*/
    if(!!vx)
    {
        this.Flags.Pose.Add(POSE_FLAGS.AIRBORNE_FB);
    }
    else
    {
        this.Flags.Pose.Add(POSE_FLAGS.AIRBORNE);
    }
    this.AdvanceJump(true);
}

Player.prototype.StopJump = function()
{
    this.PerformJump(this.jumpVelocityX_,0);
}


Player.prototype.HoldJump = function()
{
    if(!!this.jumpT_ && !!this.canHoldAirborne_)
    {
        --this.jumpT_;
    }
}

Player.prototype.SetVyFn = function(fn) { this.VyFn = this.VyFn || fn; }
Player.prototype.SetVxFn = function(fn) { this.VxFn = this.VxFn || fn; }

Player.prototype.ResetVyFn = function(fn) { this.VyFn = function(b) { return b;} }
Player.prototype.ResetVxFn = function(fn) { this.VxFn = function(b) { return b;} }

Player.prototype.ClearVyFn = function() { this.VyFn = null; }
Player.prototype.ClearVxFn = function() { this.VxFn = null; }

Player.prototype.Flip = function(isFlipped)
{
    this.isFlipped_ = isFlipped;
    ApplyFlip(this.spriteElement_,isFlipped);
}