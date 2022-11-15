
select * from par 

select * from timeframe 

insert into corretora(descricao) values ('binance');
insert into timeframe(descricao, duracao_minutos) values ('5 min', 5);
insert into timeframe(descricao, duracao_minutos) values ('15 min', 15);
insert into timeframe(descricao, duracao_minutos) values ('30 min', 30);
insert into timeframe(descricao, duracao_minutos) values ('1 h', 60);
insert into timeframe(descricao, duracao_minutos) values ('4 h', 4 * 60);
insert into timeframe(descricao, duracao_minutos) values ('1 dia', 24 * 60);

delete from candle;
ALTER TABLE candle AUTO_INCREMENT = 1;

delete from par;
ALTER TABLE par AUTO_INCREMENT = 1;
insert into par(base, quote, corretora) values('BTC','USDT',1);
insert into par(base, quote, corretora) values('QNT','USDT',1);
insert into par(base, quote, corretora) values('MATIC','USDT',1);
insert into par(base, quote, corretora) values('ADA','USDT',1);
insert into par(base, quote, corretora) values('ZIL','USDT',1);
insert into par(base, quote, corretora) values('LINK','USDT',1);
insert into par(base, quote, corretora) values('GMX','USDT',1);
insert into par(base, quote, corretora) values('ENJ','USDT',1);
insert into par(base, quote, corretora) values('PYR','USDT',1);
insert into par(base, quote, corretora) values('PHA','USDT',1);
insert into par(base, quote, corretora) values('COTI','USDT',1);

select * from candle
