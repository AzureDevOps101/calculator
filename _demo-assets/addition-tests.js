describe('Addition', function() {
    it('adds two positive integers', function(done) {
      request.get('/arithmetic?operation=add&operand1=21&operand2=21')
          .expect(200)
          .end(function(err, res) {
              expect(res.body).to.eql({ result: 42 });
              done();
          });
    });
    it('adds zero to an integer', function(done) {
      request.get('/arithmetic?operation=add&operand1=42&operand2=0')
          .expect(200)
          .end(function(err, res) {
              expect(res.body).to.eql({ result: 42 });
              done();
          });
    });
    it('adds a negative integer to a positive integer', function(done) {
      request.get('/arithmetic?operation=add&operand1=21&operand2=-42')
          .expect(200)
          .end(function(err, res) {
              expect(res.body).to.eql({ result: -21 });
              done();
          });
    });
    it('adds two negative integers', function(done) {
      request.get('/arithmetic?operation=add&operand1=-21&operand2=-21')
          .expect(200)
          .end(function(err, res) {
              expect(res.body).to.eql({ result: -42 });
              done();
          });
    });
    it('adds an integer to a floating point number', function(done) {
      request.get('/arithmetic?operation=add&operand1=2.5&operand2=-5')
          .expect(200)
          .end(function(err, res) {
              expect(res.body).to.eql({ result: -2.5 });
              done();
          });
    });
    it('adds with negative exponent', function(done) {
      request.get('/arithmetic?operation=add&operand1=1.2e-5&operand2=-1.2e-5')
          .expect(200)
          .end(function(err, res) {
              expect(res.body).to.eql({ result: 0 });
              done();
          });
    });
  });