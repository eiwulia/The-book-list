let apiKey = '';
let apiUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?';
let bookId = '';
let bookTitle = '';
let bookAuthor = '';
let addedBooks = [];
let book = '';
let errorSpan = '';
let allGoodSpan = '';
let errors = 0;
let selectedID = '';
let deleteIdSelect = '';
let bookObject = {};


$(document).ready(function() {
	let apiObject = {};
	/*Function to use old api Key */
	$('#oldApi').on('click', event => {
		let oldApi = $('#oldApiText').val();
		apiKey = oldApi;
		validation(apiObject, '#apiErrorSpan', '#apiGoodSpan');
	})

    /*Function to get a new api key */
    $('#keyButton').on('click', event => {
		const url = 'https://www.forverkliga.se/JavaScript/api/crud.php?requestKey';
		const settings = {
			method: 'GET',
			data: {
				key: 'value'
			},
		}
		$.ajax(url, settings)
		.done(whenApiKeyDone, function(response) {
			apiObject = JSON.parse(response);
			validation(apiObject, '#apiErrorSpan', '#apiGoodSpan');
		})
		.fail(onError)
		.always(onComplete)
	})
    
    /*Function to add the book in a list */
    $('#addBookButton').on('click', event => {
        let title = $('#title').val();
        let author = $('#author').val();
		const settings = {
			method: 'GET',
			data: {
				op: 'insert',
				key: apiKey,
				title: title,
				author: author
			},
		}
		$.ajax(apiUrl, settings)
        .done(function(response){
				let addBookeEror = JSON.parse(response);
				cleanTextBox(addBookeEror, $('#title'), $('#author'));
				validation(addBookeEror, '#addBookErrorSpan', '#addBookGoodSpan');
        })
        .fail(onError)
        .always(onComplete);
	})
	

	/*Function to view the book(s) */
		const viewBooks = function () {
		const settings = {
			method: 'GET',
			data: {
				op: 'select',
				key: apiKey
			},
		}
        $.ajax(apiUrl, settings)
        .done(function(response){
            bookObject = JSON.parse(response);
			addedBooks = bookObject.data;
			let bookList = $('#bookList');
			bookList.empty();
			

			if (!addedBooks){
				validation(bookObject, '#viewBookErrorSpan', '#viewBookGoodSpan');
				return bookList.html(`Oops! Something went wrong, please try again`);
			} else {
				$('#idSelect').html('<option value="book">Select book id</option>');
				$('#deleteIdSelect').html('<option value="book">Select book id</option>');
            	for(let i = 0; i < addedBooks.length; i++){
					book = addedBooks[i];
					bookId = addedBooks[i].id;
					bookTitle = addedBooks[i].title;
					bookAuthor = addedBooks[i].author;
					bookList.append(`<li>${addedBooks[i].id} "${addedBooks[i].title}" by ${addedBooks[i].author}</li>`);
					
					/*Show id's of added books on select */
					$('#idSelect').append(`<option value="${bookId}">${bookId}</option>`);
					$('#deleteIdSelect').append(`<option value="${bookId}">${bookId}</option>`);
			}
		
			validation(bookObject, '#viewBookErrorSpan', '#viewBookGoodSpan');
			
		}
	})
        .fail(onError)
        .always(onComplete);
	}

	$('#viewBooksButton').on('click', viewBooks); 

	/*Function to choose book ids in selection */
	$('#idSelect').on('change', event => {
		selectedID = $('#idSelect').attr('selected', true).val();
	})

	/*Function to change the book*/
	$('#changeBookButton').on('click', event => {
		let newBookId = selectedID;
		let newTitle = $('#newTitle').val();
		let newAuthor = $('#newAuthor').val();
		const settings = {
			method: 'GET',
			data: {
				op: 'update',
				key: apiKey,
				id: newBookId,
				title: newTitle,
				author: newAuthor
			},
		}
		
		for (let i=0; i < addedBooks.length; i++) {
			if (newBookId === bookId[i]) {
				bookTitle = newTitle[i];
				bookAuthor = newAuthor[i];
			}
		};

		$.ajax(apiUrl, settings)
		.done(function(response) {
			let changeObject = JSON.parse(response);
			validation(changeObject, '#changeBookErrorSpan', '#changeBookGoodSpan');
			cleanTextBox(changeObject, $('#newTitle'), $('#newAuthor'));
		})
		.fail(onError)
		.always(onComplete);
	})
	
	/*Function to choose book ids to DELETE */
	$('#deleteIdSelect').on('change', event => {
		deleteIdSelect = $('#deleteIdSelect').attr('selected', true).val(); 
	})

	/*Function to delete the book */
	$('#deleteButton').on('click', event => {
		let deleteId = deleteIdSelect;
		const settings = {
			method: 'GET',
			data: {
				op: 'delete',
				key: apiKey,
				id: deleteId
			},
		}
		function deleteBook() {
		for(let i=0; i<addedBooks.length; i++) {
			if (deleteId === bookId[i]) {
				addedBooks.remove(book[i]);
			}
		}
	}
		
		$.ajax(apiUrl, settings)
		.done(function(response) {
			let deleteObject = JSON.parse(response);
			validation(deleteObject, '#deleteBookErrorSpan', '#deleteBookGoodSpan');

				if (deleteObject.status === 'success') 
					viewBooks();
			
		})
		.fail(onError)
		.always(onComplete);
	})

	/*Function to clean text boxes and update the book list */
	function cleanTextBox(object, textBoxTitle, textBoxAuthor){
		if (object.status === 'success') {
		textBoxAuthor.val('');
		textBoxTitle.val('');
		viewBooks();
		}
	}

}); //Document.ready function ends here




/*Funtion to get the API key */
function whenApiKeyDone(data) {
	let object = JSON.parse(data);
	apiKey = object.key;
	$('#keyDiv').html(`Your API key is: <b>${apiKey}</b>.`);
}
function onError(x) {
	console.log(`Error! Your error code is: ${x}.`);
}
function onComplete(x) {
	console.log('All is completed', x);
}
function validation(error, errorId, allGoodId) {
	if (error.status === 'error' || !error) {
		errors += 1;
		errorSpan = $(errorId).html(`Oops! Try again! ${error.message}. Error count: ${errors}`).show();
		allGoodSpan = $(allGoodId).hide();
	} else {
		errorSpan = $(errorId).hide();
		allGoodSpan = $(allGoodId).show().fadeOut(2000);
	}
}


/*Moving background*/

let lFollowX = 0,
    lFollowY = 0,
    x = 0,
    y = 0,
    friction = 1 / 30;

function moveBackground() {
  x += (lFollowX - x) * friction;
  y += (lFollowY - y) * friction;
  
  translate = 'translate(' + x + 'px, ' + y + 'px) scale(1.1)';

  $('.bg').css({
    '-webit-transform': translate,
    '-moz-transform': translate,
    'transform': translate
  });

  window.requestAnimationFrame(moveBackground);
}

$(window).on('mousemove click', function(e) {

  let lMouseX = Math.max(-100, Math.min(100, $(window).width() / 2 - e.clientX));
  let lMouseY = Math.max(-100, Math.min(100, $(window).height() / 2 - e.clientY));
  lFollowX = (20 * lMouseX) / 100; 
  lFollowY = (10 * lMouseY) / 100;

});

moveBackground();

/*STICKY navbar */

window.onload = function() {
window.onscroll = function() {myFunction()};

let navbar = document.getElementById("optionDiv");
let sticky = navbar.offsetTop;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}
};