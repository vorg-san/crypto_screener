
select * from pair 

select * from alert


select p.id, concat(p.base, p.quote) as ticker, e.name as exchange, p.last_price
from pair p 
	join exchange e on e.id = p.exchange_id 
	
select pair_id, price
from alert
where removed is null 
	and (crossed is null or timestampdiff(hour, crossed, now()) < 1)


insert into exchange_id(name) values ('binance');
insert into timeframe(name, minutes) values ('5 min', 5);
insert into timeframe(name, minutes) values ('15 min', 15);
insert into timeframe(name, minutes) values ('30 min', 30);
insert into timeframe(name, minutes) values ('1 h', 60);
insert into timeframe(name, minutes) values ('4 h', 4 * 60);
insert into timeframe(name, minutes) values ('1 day', 24 * 60);

delete from candle;
ALTER TABLE candle AUTO_INCREMENT = 1;

delete from pair;
ALTER TABLE pair AUTO_INCREMENT = 1;
insert into pair(base, quote, exchange_id) values('BTC','USDT',1);
insert into pair(base, quote, exchange_id) values('QNT','USDT',1);
insert into pair(base, quote, exchange_id) values('MATIC','USDT',1);
insert into pair(base, quote, exchange_id) values('ADA','USDT',1);
insert into pair(base, quote, exchange_id) values('ZIL','USDT',1);
insert into pair(base, quote, exchange_id) values('LINK','USDT',1);
insert into pair(base, quote, exchange_id) values('GMX','USDT',1);
insert into pair(base, quote, exchange_id) values('ENJ','USDT',1);
insert into pair(base, quote, exchange_id) values('PYR','USDT',1);
insert into pair(base, quote, exchange_id) values('PHA','USDT',1);
insert into pair(base, quote, exchange_id) values('COTI','USDT',1);

select * from pair 
