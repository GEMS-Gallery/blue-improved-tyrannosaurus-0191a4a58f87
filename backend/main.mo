import Nat "mo:base/Nat";

import Time "mo:base/Time";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Int "mo:base/Int";

actor {
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    createdAt: Int;
  };

  stable var posts : [Post] = [];
  stable var nextId : Nat = 0;

  public query func getPosts() : async [Post] {
    Array.reverse(posts)
  };

  public func createPost(title: Text, body: Text, author: Text) : async Nat {
    let post : Post = {
      id = nextId;
      title = title;
      body = body;
      author = author;
      createdAt = Time.now();
    };
    posts := Array.append(posts, [post]);
    nextId += 1;
    post.id
  };
}
