import torch.nn as nn
import torch

class Seq2Seq(nn.Module):
    def __init__(
        self, in_maxlen, out_maxlen, n_hidden, enc_n_class, dec_n_class, d_model, num_layers
    ):
        super(Seq2Seq, self).__init__()
        self.in_maxlen = in_maxlen # 26
        self.out_maxlen = out_maxlen # 40
        self.n_hidden = n_hidden # 32
        self.enc_n_class = enc_n_class # 199
        self.dec_n_class = dec_n_class # 317
        self.d_model = d_model # 64
        self.num_layers = num_layers # 1
        
        self.encoder = nn.GRU(
            input_size = self.d_model,
            hidden_size = self.n_hidden,
            num_layers = self.num_layers,
            dropout = 0.3
        )
        self.decoder = nn.GRU(
            input_size = self.d_model,
            hidden_size = self.n_hidden,
            num_layers = self.num_layers,
            dropout = 0.3
        )
        self.embed_enc = nn.Embedding(
            num_embeddings = self.enc_n_class,
            embedding_dim = self.d_model
        )
        self.embed_dec = nn.Embedding(
            num_embeddings = self.dec_n_class,
            embedding_dim = self.d_model
        )
        
        self.fc = nn.Linear(self.n_hidden, self.dec_n_class)
    
    # runs a layer of the CNN
    def forward(self, enc_input, enc_hidden, dec_input):
        # embedded_X:[1(b), 26(in_maxlen), 64(d_model)] <- enc_input: [1(b), 26(in_maxlen)]
        embedded_X = self.embed_enc(enc_input)
        
        # embedded_X: [26(in_maxlen), 1(b), 64(d_model)] <- [1(b), 26(in_maxlen), 64(d_model)]
        embedded_X = embedded_X.permute(1, 0, 2)
        
        # For GRU -> h_t.shape: [1(num_layers), 1(b), 32(hidden_size)]
        _, h_t = self.encoder(embedded_X, enc_hidden)
        
        # embedded_Y:[1(b), 40(out_maxlen), 64(d_model)] <- dec_input: [1(b), 40(out_maxlen)]
        embedded_Y = self.embed_dec(dec_input)
        
        # embedded_Y: [40(in_maxlen), 1(b), 64(d_model)] <- [1(b), 40(out_maxlen), 64(d_model)]
        embedded_Y = embedded_Y.permute(1, 0, 2)
        outputs, _ = self.decoder(embedded_Y, h_t)
        
        # outputs: [1(b), 40(out_maxlen), 64(d_model)] <- [40(in_maxlen), 1(b), 64(d_model)]
        outputs = outputs.permute(1, 0, 2)
        
        # [1(b), 40(out_maxlen), 317(dec_n_class/output vocab_size)] <- [1(b), 40(out_maxlen), 64(d_model)]
        out = self.fc(outputs) 
        return out
    
    # creates an initial GRU tensor
    def init_enc_hidden_GRU(self, batch_size, device):
        # [1(num_layers), 1(batch_size), 32(hidden_size)]
        return torch.zeros(self.num_layers, batch_size, self.n_hidden).to(device)