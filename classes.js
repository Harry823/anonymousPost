

/*
Helper Functions
*/

var _getRandomInt = function( min, max ) {
 return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}
var _IDGenerate = function(date) {
    var length = 8;
    var timestamp = date.toString();
    var timestampSplit = timestamp.split("").reverse();
    var id = "";

    for(let i = 0; i < length; ++i) {
        var index = _getRandomInt(0, timestampSplit.length - 1);
        id += timestampSplit[index];
    }
    return id;
}

var sortGT = function(a,b) {
    if(a.postInfo.likes <= b.postInfo.likes) {
        if(a.child.length < b.child.length) {
            if(a.postInfo.dislikes > b.postInfo.dislikes) {
                return 1;
            }
            else {
                return 0;
            }
        }
        if(a.child.length == b.child.length) {
          return 0;
        }
    }
    return -1;
}

var archive = {};
function archiveStr() {
    for(let key in archive) {
        console.log(archive[key].postStr() + "\n");
    }
}

class Post {
    constructor(content, parentID = null){
        this.postInfo = {
          content: String(content),
          likes: 0,
          dislikes: 0,
          timestamp: new Date()
        };
        this.child = [];
        this.postInfo["id"] = _IDGenerate(this.postInfo.timestamp.valueOf());

        if(parentID != null) {
            this.postInfo["parent"] = parentID;
        }
        else {
            this.postInfo["parent"] = this.postInfo.id;
        }
        archive[this.postInfo.id] = this;
    }

    likePost() {
        return ++this.postInfo.likes;
    }
    dislikePost() {
        return ++this.postInfo.dislikes;
    }
    reply(content) {
        let replyPost = new Post(content, this.postInfo.id);
        this.child.push(replyPost);
        return replyPost;
    }
    postStr() {
        var result = "post ID: " + this.postInfo.id + "\n"
            + "post content: " + this.postInfo.content + "\n"
            + "like amounts: " + this.postInfo.likes + "\n"
            + "dislike amounts: " + this.postInfo.dislikes + "\n"
            + "time posted: " + this.postInfo.timestamp + "\n"
            + "parent: " + this.postInfo.parent;
        if(this.child.length > 0) {
            result += "\nChild posts of " + this.postInfo.id + ": ";
            /*
            for(let i = 0; i < this.child.length; ++i) {
                result += "\n" + this.child[i].postStr();
            }
            */
            this.child.sort(sortGT);
            for(let i = 0; i < this.child.length; ++i) {
                if(i > 0){
                    result += ", ";
                }
                result += this.child[i].postInfo.id;
            }
        }
        return result;
    }
}

/*
Test Functions
*/

function _generateTest() {
    var date = new Date;
    var id = _IDGenerate(date.valueOf());
    console.log("Generated ID:",id);
}
function _testLike() {
    var testPost = new Post("test");
    console.log("Initial Post \n\n" + testPost.postStr() + "\n");
    console.log("archive: ");
    console.log(archive);

    for(let i = 0; i < 100000; ++i) {
        let n = _getRandomInt(0,1);
        if(n == 0) {
          testPost.likePost();
        }
        if(n == 1) {
          testPost.dislikePost();
        }
    }

    console.log("post after likes and dislikes \n\n"
      + testPost.postStr() + "\n");
}
function _testArchive(sampleText) {
   var splitText = sampleText.split(".");
   for(let i = 0; i < splitText.length; ++i) {
      new Post(splitText[i]);
   }
   console.log(archive);
}
function _testReply(sampleText) {
    var randomProperty = function (obj) {
        var keys = Object.keys(obj)
        return obj[keys[ keys.length * Math.random() << 0]];
    };
    var splitText = sampleText.split(".");
    var testPost = new Post("test");
    for(let i = 0; i < splitText.length; ++i) {
        randomProperty(archive).reply(splitText[i]);
    }
    //onsole.log("reply: \n" + replyPost.postStr());
    console.log("\n\nArchive after replies: ");
    archiveStr();
}

//_generateTest();
//_testLike();
/*_testArchive("Lorem ipsum dolor sit amet. consectetur adipiscing elit.\
 sed do eiusmod tempor incididunt. ut labore et dolore magna aliqua.\
  Ut enim ad minim veniam. quis nostrud. exercitation ullamco \
  laboris nisi ut. aliquip ex. ea commodo consequat. Duis aute irure dolor in\
   reprehenderit. in voluptate velit esse cillum dolore eu fugiat nulla\
    pariatur. Excepteur. sint occaecat cupidatat non proident. sunt in culpa\
     qui officia deserunt mollit anim id est laborum.");
     */
_testReply("Lorem ipsum dolor sit amet. consectetur adipiscing elit.\
 sed do eiusmod tempor incididunt. ut labore et dolore magna aliqua.\
  Ut enim ad minim veniam. quis nostrud. exercitation ullamco \
  laboris nisi ut. aliquip ex. ea commodo consequat. Duis aute irure dolor in\
   reprehenderit. in voluptate velit esse cillum dolore eu fugiat nulla\
    pariatur. Excepteur. sint occaecat cupidatat non proident. sunt in culpa\
     qui officia deserunt mollit anim id est laborum.");
