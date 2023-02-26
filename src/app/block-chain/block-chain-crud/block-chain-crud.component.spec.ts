import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockChainCrudComponent } from './block-chain-crud.component';

describe('BlockChainCrudComponent', () => {
  let component: BlockChainCrudComponent;
  let fixture: ComponentFixture<BlockChainCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockChainCrudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockChainCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
