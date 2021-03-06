<!DOCTYPE html>
<html lang="en">
	<!-- CSS -->
	<link href="../assets/bootstrap-3.3.5-dist/css/bootstrap.min.css" rel="stylesheet">
	<link href="../assets/css/main.css" rel="stylesheet">

	<!-- Script -->
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script type="text/javascript" src="../assets/bootstrap-3.3.5-dist/js/bootstrap.js"></script>

	<head>
		<title>MAWILE</title>
	</head>
	
	<body>
		<div class="container">
			<div id="header1">
				<nav class="navbar navbar-default">
					<div class="container-fluid">
						<!-- Brand and toggle get grouped for better mobile display -->
						<div class="navbar-header">
							<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
								<span class="sr-only">Toggle navigation</span>
								<!-- Jumlah garis -->
								<span class="icon-bar"></span>
								<span class="icon-bar"></span>
								<span class="icon-bar"></span>
							</button>
							<img src="../assets/img/Mega-Mawile.png" class="img-responsive" alt="Responsive image" width="50px" height="50px">
						</div>

						<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
							<ul class="nav navbar-nav navbar-right">
								<li><a href="#">Home</a></li>
								<li><a href="#">Experimental</a></li>
								<li><a href="#">Interactive</a></li>
								<li><a href="#">Help</a></li>
							</ul>
						</div><!-- /.navbar-collapse -->
					</div><!-- /.container-fluid -->
				</nav>
			</div>
			
			<div id="header2">
				<br><h2 class="text-center">SEARCH ANYTHING<h2>
			</div>
			
			<div id="content">
				<form class="form-horizontal">
					<!-- Query Location -->
					<div class="form-group">
						<label class="col-sm-5 control-label">Query</label>
						<div class="col-sm-3">
							<input type="text" class="form-control" placeholder="materi STBI computer science">
						</div>
					</div>
					
					<!-- Radio button -->
					<br>
					<div class="row">
						<div class="col-md-6">
							<!-- Algoritma -->
							<label class="col-md-offset-7 col-md-6">Algoritma</label>
							<!-- Rocchio -->
							<br>
							<div class="radio" id="Algoritma-Rocchio">
								<label class="col-md-offset-7 col-md-6">
									<input type="radio" name="A" id="A1" value="option1" checked>
									Rocchio
								</label>
							</div>
							
							<!-- Ide reguler -->
							<div class="radio">
								<label class="col-md-offset-7 col-md-6">
									<input type="radio" name="A" id="A2" value="option2">
									Ide reguler
								</label>
							</div>
							
							<!-- Dec hi -->
							<div class="radio">
								<label class="col-md-offset-7 col-md-6">
									<input type="radio" name="A" id="A3" value="option3">
									Dec hi
								</label>
							</div>
							
							<!-- Pseudo Relevance Feedback -->
							<div class="radio" id="Algoritma-Pseudo">
								<label class="col-md-offset-7 col-md-6">
									<input type="radio" name="A" id="A4" value="option4">
									Pseudo Relevance Feedback
								</label>
							</div>
							
							<!-- Top S Document -->
							<br>
							<div class="form-group" id="toggle-hidden-Top-S">
								<label class="col-sm-7 control-label">Top S</label>
								<div class="col-sm-2">
									<input type="text" class="form-control">
								</div>
							</div>
							
							<!-- Top N Document -->
							<div class="form-group" id="toggle-hidden-Top-N">
								<label class="col-sm-7 control-label">Top N</label>
								<div class="col-sm-2">
									<input type="text" class="form-control">
								</div>
							</div>
						</div>
						
						<div class="col-md-6">
							<!-- Same Document? -->
							<label class="col-md-offset-3 col-md-6">
								Use Same Document?
							</label>
							<!-- Use Same Document -->
							<br>							
							<div class="radio">
								<label class="col-md-offset-3 col-md-6">
									<input type="radio" name="USD" id="USD1" value="option1" checked>
									Yes
								</label>
							</div>
							
							<!-- Don't Use Same Document -->
							<div class="radio">
								<label class="col-md-offset-3 col-md-6">
									<input type="radio" name="USD" id="USD2" value="option2">
									No
								</label>
							</div>
							
							<!-- Query Expansion? -->
							<br>
							<label class="col-md-offset-3 col-md-6">
								Use Query Expansion?
							</label>
							<!-- Use Same Document -->
							<br>							
							<div class="radio">
								<label class="col-md-offset-3 col-md-6">
									<input type="radio" name="UQE" id="UQE1" value="option1" checked>
									Yes
								</label>
							</div>
							
							<!-- Don't Use Same Document -->
							<div class="radio">
								<label class="col-md-offset-3 col-md-6">
									<input type="radio" name="UQE" id="UQE2" value="option2">
									No
								</label>
							</div>
							
							<!-- Finish button -->
							<br><br>
							<div class="form-group">
								<div class="col-sm-offset-3 col-sm-6">
									<button type="submit" class="btn btn-default">Indexing</button>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</body>
	
	<!-- Script -->
	 <script>
		$("#Algoritma-Rocchio").click(function () {
			$("#toggle-hidden-Top-S").css("display", "block");
			$("#toggle-hidden-Top-N").css("display", "none");
		});
		
		$("#Algoritma-Pseudo").click(function () {
			$("#toggle-hidden-Top-S").css("display", "none");
			$("#toggle-hidden-Top-N").css("display", "block");
		});
	</script>
</html>