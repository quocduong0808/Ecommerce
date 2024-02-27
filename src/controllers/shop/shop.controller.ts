import { NameClass, getBeanContext } from '../../commons/app.context';
import { Request, Response } from 'express';
import { IProduct } from '../../dtos/product.dto';
import ApiRes from '../../models/apiRes.model';
import httpStatus from 'http-status';
import { producService } from '../../services/product.service';

class ShopController implements NameClass {
  getName(): string {
    return 'ShopController';
  }
  public async createProduct(req: Request, res: Response) {
    const data = req.body as IProduct;
    data.shop = req.session.auth?.user._id;
    return res
      .status(httpStatus.OK)
      .send(
        new ApiRes(
          httpStatus.OK,
          httpStatus[httpStatus.OK],
          await producService.create(data)
        )
      );
  }
  public async getDraftProds(req: Request, res: Response) {
    const id = req.session.auth?.user._id;
    return res
      .status(httpStatus.OK)
      .send(
        new ApiRes(
          httpStatus.OK,
          httpStatus[httpStatus.OK],
          await producService.getAllDrafProd(id || '')
        )
      );
  }
}

const shopController = getBeanContext<ShopController>(
  ShopController,
  () => new ShopController()
);
export { shopController };
