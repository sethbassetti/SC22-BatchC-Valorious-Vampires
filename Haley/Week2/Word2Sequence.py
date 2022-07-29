class Word2Sequence:
    PAD_TAG = "<PAD>" # Padding Token
    SOS_TAG = "<SOS>" # Start Of Sentence Token
    EOS_TAG = "<EOS>" # End Of Sentence Token
    UNK_TAG = "<UNK>" # unknown Token

    PAD = 0
    SOS = 1
    EOS = 2
    UNK = 3
    
    special_tokens = [PAD_TAG, SOS_TAG, EOS_TAG, UNK_TAG]
        
    def __init__(self, custom_dict = None):
        self.dict = {
            self.PAD_TAG : self.PAD,
            self.SOS_TAG : self.SOS,
            self.EOS_TAG : self.EOS,
            self.UNK_TAG : self.UNK
        } if custom_dict == None else custom_dict
        
        self.count = {}

    def fit(self, sentence):
        """save words in sentence to self.dict
        param: sentence (1D List): [word1, word2, word3...]
        """
        # counts the times a word occurs in the sentence
        for word in sentence:
            self.count[word] = self.count.get(word, 0) + 1

    def build_vocab(self, min=5, max=None, max_features=None):
        """
        build self.dict and reverse_dict
        param min:          least occurrance of word to be considered
        param max:          max occurrance of word to be considered
        param max_features: max vocab size for tokenizer
        returns:            
        """
        # Delete words in count whose word frequency is less than min
        if min is not None:
            self.count = {word: value for word,value in self.count.items() if value > min}
        # Delete the value with the number of times greater than max
        if max is not None:
            self.count = {word: value for word,value in self.count.items if value < max}
        # Limit the number of reserved words
        if max_features is not None:
            temp = sorted(self.count.items(), key=lambda x:x[-1], reverse=True)[:max_features]
            self.count = dict(temp)
        # adds the words to the dictionary and gives them an ID
        for word in self.count:
            if word not in self.special_tokens:
                self.dict[word] = len(self.dict)
        
        # reversed self.dict
        self.reverse_dict = dict(zip(self.dict.values(), self.dict.keys()))
    
    def transform(self, sentence, max_len=None, pad_first=False):
        """
        convert setence to int sequence
        param sentence: [word1, word2, word3 ...]
        param max_len: int, do padding or truncation
        returns: 1D List of integers
        """
        # Make the sentence the right length
        if max_len is not None: # do padding here
            if pad_first == False:
                if max_len > len(sentence):
                    sentence = sentence + [self.PAD_TAG] * (max_len-len(sentence))
                if max_len < len(sentence):
                    sentence = sentence[:max_len] #truncation
            else:
                if max_len > len(sentence):
                    sentence = [self.PAD_TAG] * (max_len-len(sentence)) + sentence
                if max_len < len(sentence):
                    sentence = sentence[-max_len:] #truncation
        # return words as ids
        return [self.dict.get(word, self.UNK) for word in sentence]
    
    def inverse_transform(self, indices, is_tensor=False):
        """
        convert int sequences to string words
        param indices: [1, 2, 3, ...]
        returns: [word1, word2, word3...]
        """
        if is_tensor == False:
            # If the 1D array is PyTorch Tensor do this:
            return [self.reverse_dict.get(idx) for idx in indices]
        
        else:
            
            return [self.reverse_dict.get(idx.item()) for idx in indices]

    def __len__(self):
        '''
        returns the number of words categorized (including special tokens)
        '''
        return (len(self.dict))