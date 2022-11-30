
select * from timeframe  

select * from alert 

select * from pair

select pair_id, price, above, crossed
from alert
where crossed is not null

select pair_id, count(id) from candle group by pair_id

select pair_id, start, close
from ( 
	select pair_id, start, close, ROW_NUMBER() OVER (PARTITION BY pair_id, timeframe_id ORDER BY start DESC) AS n 
	from candle
	where pair_id in (1,2)
		and timeframe_id = 4
) t
where n <= 10
order by pair_id, start desc 

select p.id, concat(p.base, p.quote) as ticker, e.name as exchange, p.last_price
from pair p 
	join exchange e on e.id = p.exchange_id 

select *
from pair
where low_volume = 0
	
select pair_id, price
from alert
where removed is null 
	and (crossed is null or timestampdiff(hour, crossed, now()) < 1)


insert into exchange(name) values ('binance');
insert into timeframe(name, minutes) values ('5m', 5);
insert into timeframe(name, minutes) values ('15m', 15);
insert into timeframe(name, minutes) values ('30m', 30);
insert into timeframe(name, minutes) values ('1h', 60);
insert into timeframe(name, minutes) values ('4h', 4 * 60);
insert into timeframe(name, minutes) values ('1d', 24 * 60);

delete from alert;
ALTER TABLE alert AUTO_INCREMENT = 1;
delete from candle;
ALTER TABLE candle AUTO_INCREMENT = 1;
delete from pair;
ALTER TABLE pair AUTO_INCREMENT = 1;
delete from timeframe;
ALTER TABLE timeframe AUTO_INCREMENT = 1;

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

select * from exchange e  
