# USP Mobile: bandejão

Aplicativo para consulta do cardápio do bandejão da USP.

## YQL

O [YQL](https://developer.yahoo.com/yql/) é uma linguagem semelhante ao SQL que permite a realização de buscas, filtros e uniões de dados entre Web services. Neste aplicativo desenvolvemos uma tabela de dados (arquivo que define como as consultas são realizadas) para os cardápios dos bandejões disponíveis em: [http://www.usp.br/coseas/COSEASHP/COSEAS2010_cardapio.html](http://www.usp.br/coseas/COSEASHP/COSEAS2010_cardapio.html).

A tabela usp.bandejao está definida no arquivo [usp.bandejao.xml](usp.bandejao.xml). O processamento é definido no código em Javascript.

### Testando a tabela de dados do bandejão

Basta entrar na página do [console interativo do YQL](https://developer.yahoo.com/yql/console/) e preencher o campo "YOUR YQL STATEMENT" com a consulta desejada que deve seguir o formato:

    use 'https://raw.githubusercontent.com/toshikurauchi/usp-mobile-bandeco/master/usp.bandejao.xml'; 
    select * from usp.bandejao where bandejao="bandejaoDesejado";

Onde `bandejaoDesejado` é algum entre: `central`, `fisica`, `quimica`, `pusp`, `doc`, `enf`, `fsp`, `direito`. Por exemplo:

    use 'https://raw.githubusercontent.com/toshikurauchi/usp-mobile-bandeco/master/usp.bandejao.xml';
    select * from usp.bandejao where bandejao="central";

para consultar o cardápio do bandejão central. Note que a palavra `use` indica para o YQL que queremos utilizar a tabela definida na url indicada.