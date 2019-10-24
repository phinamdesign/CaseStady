var myCanvas = document.getElementById('myCanvas');
        var ctx = myCanvas.getContext('2d');
        var isGameOver = false;

        // Khai báo lớp bóng
        var ball = new Ball(295, 460,7,5,15);
        function Ball(x, y, dx, dy, radius){
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.radius = radius;

            // Vẽ bóng
            this.drawBall = function(){
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
                ctx.fillStyle = 'red';
                ctx.fill();
                ctx.closePath();
            }

            //Tọa độ thay đổi khi vẽ lại bóng
            this.coordinatesBall = function(){
                this.x += this.dx;
                this.y +=  -this.dy;
            }

            //Bóng va chạm với biên
            this.ballCollision = function(){
                if(this.x < this.radius || this.x > myCanvas.width - this.radius ){
                    this.dx = -this.dx;
                }
                if(this.y < this.radius || this.y > myCanvas.height - this.radius){
                    this.dy = -this.dy;
                }

                // Xử lý va chạm với đường bbieen dưới (GameOver)

                this.checkBall = function(){
                    if(this.y > myCanvas.height - this.radius){
                        isGameOver = true;
                    }
                }

            };
         }

        // Khởi tạo lớp ván 
        var plank = new Plank(255, myCanvas.height-20, 100,20,10);
        function Plank(x, y, width, height, speed){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.speed = speed;

            // Vẽ tám ván
            this.drawPlank = function(){
                ctx.beginPath();
                ctx.rect(this.x, this.y, this.width, this.height);
                ctx.fillStyle = 'red';
                ctx.fill();
                ctx.closePath();
            }

            //Xử lya va chạm của bong với tấm ván
            this.collisionPlank = function() {
                if (ball.x + ball.radius >= this.x && ball.x + ball.radius <= this.x + this.width &&
                    ball.y + ball.radius >= myCanvas.height - this.height){
                    ball.dy = -ball.dy;
                }
            }

            // Kiểm tra hướng di chuyển của thanh ván đang là trái hay phải
            this.checkMovingPlank = function(){
                if(this.isMovingLeft){
                    this.x -= this.speed;
                }else if(this.isMovingRight){
                    this.x += this.speed;
                }
            }

            // Xử lý di chuyển của ván với biên ( ván ko vuowtj quá biên);
            this.movingEdgePlank = function(){
                if(this.x < 0){
                    this.x = 0;
                }else if(this.x > myCanvas.width - this.width){
                    this.x = myCanvas.width - this.width;
                }
            }


        };

         //Xử lý sự kiện bàn phím của plank
        document.addEventListener("keyup", function (event) {
            if (event.keyCode == 37){
                plank.isMovingLeft = false;
            }else if (event.keyCode == 39){
                plank.isMovingRight = false;
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.keyCode == 37){
                plank.isMovingLeft = true;
            }else if (event.keyCode == 39){
                plank.isMovingRight= true;
            }
        });


        //  Vẽ các viên gạch      
        var brick = new Brick(25,40,15, 80, 25, 6, 4,[]); 
        function Brick(x, y, margin, width, height, totalRow, totalCol, []){
            this.x = x;
            this.y = y;
            this.margin = margin;
            this.width = width;
            this.height = height;
            this.totalRow = totalRow;
            this.totalCol = totalCol;
            this.bricks = [];

            //Tạo mảng lưu tọa độ của các viên gạch
            for(var i=0; i<this.totalCol; i++) {
                this.bricks[i] = [];
                for(var j=0; j<this.totalRow; j++) {
                    this.bricks[i][j] = { x: 0, y: 0, status: 1 };
                }
            }

            // Tạo ra các vien gạch
            this.drawBricks = function() {
                for(var i=0; i<this.totalCol; i++) {
                    for(var j=0; j<this.totalRow; j++) {
                        if(this.bricks[i][j].status == 1) {
                            var brickX = ( j * (this.width + this.margin)) + this.x;
                            var brickY = ( i * (this.height + this.margin)) + this.y;
                            this. bricks[i][j].x = brickX;
                            this.bricks[i][j].y = brickY;
                            ctx.beginPath();
                            ctx.rect(brickX, brickY, this.width, this.height);
                            ctx.fillStyle = "yellow";
                            ctx.fill();
                            ctx.closePath();
                        }
                    }
                }
            }

            // Xử lý va chạm giữa bóng và gạch
            this.collisionDetection = function() {
                for(var i=0; i<this.totalCol; i++) {
                    for(var j=0; j<this.totalRow; j++) {
                        var b = this.bricks[i][j];
                        if(b.status == 1) {
                            if(ball.x > b.x && ball.x < b.x+this.width && ball.y > b.y && ball.y < b.y+this.height) {
                                ball.dy = -ball.dy;
                                b.status = 0;
                                score++;
                                if(score == this.totalRow*this.totalCol) {
                                    win();
                                    document.location.reload();
                                }
                            }
                        }
                    }
                }
            }
                
        }



        var score = 0;
        var lives = 3;

        // Hiển thị diểm số
        function drawScore() {
            ctx.font = "16px Arial";
            ctx.fillStyle = "red";
            ctx.fillText("Score: "+score, 8, 20);
        }

        // Thông báo khi win
        function win() {
            ctx.font = "80px Arial ";
            ctx.fillStyle = "red";
            ctx.fillText("Winnnn",90,250);
            ctx.font = "40px Arial ";
            ctx.fillText("Score : "+score,180,300);
        }

        // Thông báo khi heét lượt
        function gameOver() {
            ctx.font = "80px Arial ";
            ctx.fillStyle = "red";
            ctx.fillText("Game Over",90,250);
            ctx.font = "40px Arial ";
            ctx.fillText("Score : "+score,200,300);
        }

        function restart(){
            document.location.reload();
        }
        
        function addMusic(){
            document.getElementById("music").innerHTML =
             "<audio autoplay>"+
                "+<source src='music/mario.mp3'>"+
            +"</audio>";

        
        }

        function addImage(){
            document.getElementsByTagName('src').value ='background-image: url("")';
        }
       function draw(){
           if(!isGameOver){
            addImage();
            ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
            brick.drawBricks();
            drawScore();
            // drawLives();
            brick.drawBricks();
            brick.collisionDetection();
            plank.drawPlank();
            plank.collisionPlank();
            plank.checkMovingPlank();
            plank.movingEdgePlank();
            ball.drawBall();
            ball.ballCollision();
            ball.coordinatesBall();
            ball.checkBall();
            requestAnimationFrame(draw);
           }else{
            addMusic();
            gameOver();
           
            }
       }
      